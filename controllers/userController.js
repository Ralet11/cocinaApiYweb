
import { User } from '../models/index.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Si no está importado, agrega esta línea
import Address from '../models/Addresses.model.js';

const SECRET_KEY = "tu_clave_secreta"; // Asegúrate de definir tu clave secreta

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
  try {
    const record = await User.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'User no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro' });
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
      SECRET_KEY,
      { expiresIn: '1h' } // Expiración del token
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
