import { Category, Partner, Product, PartnerIngredient, Ingredient, PartnerProducts, ProductIngredient } from '../models/index.models.js';
import { getDistance } from 'geolib';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from "fs";
import path from "path";
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize';

const SECRET_KEY = process.env.JWT_SECRET || "tu_clave_secreta";

// Define __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminHtmlTemplate = fs.readFileSync(
  path.join(__dirname, "../templates", "adminTemplate.html"),
  "utf8"
);

const aspirantHtmlTemplate = fs.readFileSync(
  path.join(__dirname, "../templates", "aspirantTemplate.html"),
  "utf8"
);
dotenv.config();
// Obtener todos los partners
const getAllPartners = async (req, res) => {
  try {
    const records = await Partner.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

// Obtener un partner por ID
const getPartnerById = async (req, res) => {
  try {
    const record = await Partner.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'Partner no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

export const loginPartner = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar partner por email
    const partner = await Partner.findOne({ where: { email } });
    if (!partner) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comparar contraseña
    const isPasswordValid = await bcrypt.compare(password, partner.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: partner.id, email: partner.email },
      SECRET_KEY,
   
    );

    // Enviar respuesta con usuario y token
    res.json({
      message: 'Inicio de sesión exitoso',
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        latitude: partner.latitude,
        longitude: partner.longitude,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};



export const requestPartner = async (req, res) => {
  console.log(req.body)
  const { name, lastName, email, birthdate, latitude, longitude } = req.body;

  try {
    // Configuración del transporte de Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Enviar correo al administrador
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Nuevo Registro de Partner",
      html: adminHtmlTemplate.replace("{{name}}", name)
                             .replace("{{lastName}}", lastName)
                             .replace("{{email}}", email)
                             .replace("{{birthdate}}", birthdate)
                             .replace("{{latitude}}", latitude)
                             .replace("{{longitude}}", longitude),
    });

    // Enviar correo al aspirante
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Tu solicitud está en revisión",
      html: aspirantHtmlTemplate.replace("{{name}}", name),
    });;

    // Responder al frontend
    res.status(200).json({ message: "Correos enviados correctamente" });
  } catch (error) {
    console.error("Error al enviar correos:", error);
    res.status(500).json({ error: "No se pudo enviar la solicitud. Inténtalo más tarde." });
  }
};



export const registerPartner = async (req, res) => {


  const { name, lastName, email, password, birthdate, latitude, longitude,address } = req.body;

  try {
    // Verificar si el email ya está registrado
    const existingPartner = await Partner.findOne({ where: { email } });
    if (existingPartner) {
      return res.status(400).json({ error: 'El correo ya está en uso' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo Partner
    const newPartner = await Partner.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      birthdate,
      latitude,
      longitude,
      address
    });

    // Generar un token JWT
    const token = jwt.sign(
      { id: newPartner.id, email: newPartner.email },
      SECRET_KEY,
      { expiresIn: '1h' } // Cambiar según sea necesario
    );
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newPartner.id,
        name: newPartner.name,
        lastName: newPartner.lastName,
        email: newPartner.email,
        birthdate: newPartner.birthdate,
        latitude: newPartner.latitude,
        longitude: newPartner.longitude,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const updatePartner = async (req, res) => {

  try {
    const record = await Partner.findByPk(req.user.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'Partner no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

// Eliminar un partner
const deletePartner = async (req, res) => {
  try {
    const record = await Partner.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'Partner eliminado correctamente' });
    } else res.status(404).json({ error: 'Partner no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};



// Obtener el partner más cercano utilizando geolib
const getClosestPartner = async (req, res) => {

  
  const { latitude, longitude } = req.body.address;

  const lat = latitude
  const lng = longitude



  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
  }

  try {
    const partners = await Partner.findAll();
    if (partners.length === 0) {
      return res.status(404).json({ error: 'No se encontraron partners' });
    }

    let closestPartner = null;
    let minDistance = Infinity;



    for (const partner of partners) {
      const distance = getDistance(
        { latitude: lat, longitude: lng },
        { latitude: partner.latitude, longitude: partner.longitude }
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestPartner = partner;
      }
    }
 
    res.json({ closestPartner, distance: minDistance });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el partner más cercano' });
  }
};

// Obtener los productos de un partner específico por ID

const getPartnerProducts = async (req, res) => {

  
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'No hay información de usuario válida en el token.' });
    }
    const partnerId = req.user.id;
    const partner = await Partner.findByPk(partnerId, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'img', 'discount', 'description'],
          through: { attributes: ['inStock'] },
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });
    if (!partner) {
      return res.status(404).json({ error: 'Partner no encontrado' });
    }
    if (!partner.products || partner.products.length === 0) {
      return res.json({ partner: partner.name, cat: {} });
    }
    const groupedProducts = {};
    partner.products.forEach((product) => {
      const productInStock = product.partner_products?.inStock ?? true;
      if (product.categories && product.categories.length > 0) {
        product.categories.forEach((category) => {
          if (!groupedProducts[category.name]) {
            groupedProducts[category.name] = [];
          }
          groupedProducts[category.name].push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            discount: product.discount,
            description: product.description,
            inStock: productInStock
          });
        });
      }
    });
    return res.json({ partner: partner.name, cat: groupedProducts });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los productos del partner' });
  }
};


const getPartnerProductsApp = async (req, res) => {

  
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'No hay información de usuario válida en el token.' });
    }
    const partnerId = req.params.id;
    const partner = await Partner.findByPk(partnerId, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'img', 'discount', 'description'],
          through: { attributes: ['inStock'] },
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });
    if (!partner) {
      return res.status(404).json({ error: 'Partner no encontrado' });
    }
    if (!partner.products || partner.products.length === 0) {
      return res.json({ partner: partner.name, cat: {} });
    }
    const groupedProducts = {};
    partner.products.forEach((product) => {
      const productInStock = product.partner_products?.inStock ?? true;
      if (product.categories && product.categories.length > 0) {
        product.categories.forEach((category) => {
          if (!groupedProducts[category.name]) {
            groupedProducts[category.name] = [];
          }
          groupedProducts[category.name].push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            discount: product.discount,
            description: product.description,
            inStock: productInStock
          });
        });
      }
    });
    return res.json({ partner: partner.name, cat: groupedProducts });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los productos del partner' });
  }
};

 const updatePartnerIngredient = async (req, res) => {
  try {
    const partner_id = req.user.id;
    const { ingredient_id, inStock } = req.body;
    const [updatedCount] = await PartnerIngredient.update(
      { inStock },
      { where: { partner_id, ingredient_id } }
    );
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'No se encontró la relación partner-ingredient.' });
    }
    if (!inStock) {
      const productIngredients = await ProductIngredient.findAll({ where: { ingredient_id } });
      const productIds = productIngredients.map(pi => pi.product_id);
      await PartnerProducts.update(
        { inStock: false },
        { where: { partner_id, product_id: productIds } }
      );
    } else {
      const productIngredients = await ProductIngredient.findAll({ where: { ingredient_id } });
      const productIds = productIngredients.map(pi => pi.product_id);
      for (const pId of productIds) {
        const allIngredients = await ProductIngredient.findAll({ where: { product_id: pId } });
        const ingIds = allIngredients.map(i => i.ingredient_id);
        const totalIngredients = ingIds.length;
        const inStockCount = await PartnerIngredient.count({
          where: { partner_id, ingredient_id: ingIds, inStock: true }
        });
        if (totalIngredients === inStockCount) {
          await PartnerProducts.update(
            { inStock: true },
            { where: { partner_id, product_id: pId } }
          );
        }
      }
    }
    return res.status(200).json({ message: 'PartnerIngredient actualizado con éxito.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor.' });
  }
};


// Obtener todos los ingredientes del partner autenticado
const getPartnerIngredients = async (req, res) => {
  console.log("inged"); // Para comprobar que llega
  try {
    const partner_id = req.user.id; // Obtenemos el ID del partner desde el token

    // Buscar todos los ingredientes que tiene este partner en la tabla `partner_ingredient`
    const partnerIngredients = await PartnerIngredient.findAll({
      where: { partner_id },
      include: [
        {
          model: Ingredient, // Incluimos detalles del ingrediente
          attributes: ['id', 'name'],
        },
      ],
    });

    // Si no se encuentran registros
    if (!partnerIngredients.length) {
      return res.status(404).json({ message: 'No hay ingredientes registrados para este partner.' });
    }

    // Formateamos la respuesta para devolver: { id, name, inStock }
    const ingredients = partnerIngredients.map((pi) => ({
      id: pi.ingredient.id,
      name: pi.ingredient.name,
      inStock: pi.inStock,
    }));

    return res.status(200).json(ingredients);
  } catch (error) {
    console.error('Error al obtener ingredientes del partner:', error);
    return res.status(500).json({ message: 'Error en el servidor.' });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log(email, "body")
  try {
      const partner = await Partner.findOne({ where: { email } });
      if (!partner) return res.status(404).json({ message: 'No existe una cuenta con este correo' });

      const token = crypto.randomBytes(32).toString('hex');
      partner.resetToken = token;
      partner.resetTokenExpiration = Date.now() + 3600000; // 1 hora
      await partner.save();

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const resetUrl = `http://localhost:5173/reset-password/${token}`;
      await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: "Recuperación de contraseña",
          html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                 <a href="${resetUrl}">${resetUrl}</a>
                 <p>Este enlace expira en 1 hora.</p>`
      });

      res.json({ message: 'Correo de recuperación enviado' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 📌 Restablecer contraseña
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
      const partner = await Partner.findOne({ where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } } });
      if (!partner) return res.status(400).json({ message: 'Token inválido o expirado' });

      partner.password = await bcrypt.hash(password, 10);
      partner.resetToken = null;
      partner.resetTokenExpiration = null;
      await partner.save();

      res.json({ message: 'Contraseña actualizada correctamente' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
  }
};


export {
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
  getClosestPartner,
  getPartnerProducts,
  updatePartnerIngredient,
  getPartnerIngredients,
  getPartnerProductsApp
};