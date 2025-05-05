
import { User } from '../models/index.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Si no está importado, agrega esta línea
import Address from '../models/addresses.model.js';
import crypto from 'crypto';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';

const SECRET_KEY = process.env.JWT_SECRET || "tu_clave_secreta";

const getAllUsers = async (req, res) => {
  try {
    const records = await User.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

const getUserById = async (req, res) => {
  try {
    const record = await User.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'User no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

const createUser = async (req, res) => {
  try {
    const newRecord = await User.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, ...rest } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User no encontrado" });

    // e‑mail duplicado
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ error: "El correo ya está en uso" });
      user.email = email;
    }

    // cambio de contraseña opcional
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    // resto de campos válidos
    Object.entries(rest).forEach(([k, v]) => {
      if (v !== undefined) user[k] = v;
    });

    await user.save();

    const { password: _p, ...safeUser } = user.toJSON();
    res.json({ message: "Usuario actualizado", user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar registro" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const record = await User.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'User eliminado correctamente' });
    } else res.status(404).json({ error: 'User no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comparar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY
    );

    // Enviar respuesta con usuario y token
    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
const registerUser = async (req, res) => {
  const { name, lastName, email, password, birthdate } = req.body;

  try {
    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      birthdate,
    });

    // Generar un token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      SECRET_KEY,
      { expiresIn: '1h' } // Cambiar según sea necesario
    );
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        birthdate: newUser.birthdate,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

9

const getAddressesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Obtener todas las direcciones de un usuario
    const addresses = await Address.findAll({
      where: { user_id: userId }
    });

    res.status(200).json(addresses);
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
};

const createAddress = async (req, res) => {
  const { user_id, street, city, state, zipCode, country, type, latitude, longitude, apartNumb, comments } = req.body;
  console.log(req.body, "body");

  try {

    if (!user_id || !street || !type) {
      console.log("error en los campos", req.body);
      return res.status(400).json({ error: 'Los campos user_id, street y type son obligatorios' });
    }

    // Crear la nueva dirección con los nuevos campos
    const newAddress = await Address.create({
      user_id,
      street,
      city: city || null,
      state: state || null,
      zipCode: zipCode || "",
      country: country || null,
      type,
      lat: latitude || null,
      lng: longitude || null,
      apartNumb: apartNumb || null,
      comments: comments || null,
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error al crear la dirección:', error);
    res.status(500).json({ error: 'Error al crear la dirección' });
  }
};


const deleteAddress = async (req, res) => {
  const { id } = req.params; // o el nombre que uses en tu ruta
  console.log(id, "adrres id")

  try {
    // Buscar la dirección por ID
    const address = await Address.findByPk(id);

    // Verificar si existe
    if (!address) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }

    // Eliminar la dirección
    await address.destroy();

    // Responder con éxito
    res.json({ message: 'Dirección eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la dirección:', error);
    res.status(500).json({ error: 'Error al eliminar la dirección' });
  }
};

// 📌 Solicitar recuperación de contraseña
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'No existe una cuenta con este correo' });

      // Generar token de recuperación con expiracion de 1 hs
      const token = crypto.randomBytes(32).toString('hex');
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000; // 1 hora
      await user.save();

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const resetUrl = `http://localhost:5173/reset-password/user/${token}`;
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
  const { token } = req.params;  //traemos el toquen de la resetURL
  const { password } = req.body;

  try {
      const user = await User.findOne({ where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } } });
      if (!user) return res.status(400).json({ message: 'Token inválido o expirado' });

      user.password = await bcrypt.hash(password, 10);
      user.resetToken = null;
      user.resetTokenExpiration = null;
      await user.save();

      res.json({ message: 'Contraseña actualizada correctamente' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
  }
};


export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  createAddress,
  getAddressesByUser,
  deleteAddress
};
