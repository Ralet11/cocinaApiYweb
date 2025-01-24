import jwt from 'jsonwebtoken';

// const SECRET_KEY = process.env.JWT_SECRET || "tu_clave_secreta";

// export const validateToken = (req, res, next) => {
//   const authHeader = req.header('Authorization');
//   console.log('Authorization Header:', authHeader);

//   // Verifica que el encabezado exista
//   if (!authHeader) {
//     return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
//   }

//   // Extrae el token
//   const token = authHeader.split(' ')[1];
//   console.log('Token:', token);

//   // Verifica que el token exista
//   if (!token) {
//     return res.status(401).json({ error: 'Token no encontrado.' });
//   }

//   try {
//     // Verifica el token
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded; // Agrega el usuario decodificado al objeto de la solicitud
//     console.log('Decoded Token:', decoded);
//     next(); // Continúa con la siguiente middleware o controlador
//   } catch (error) {
//     console.error('JWT Error:', error);
//     return res.status(401).json({ error: 'Token inválido o expirado.' });
//   }
// };



const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('La clave secreta JWT_SECRET no está definida en las variables de entorno.');
}

export const validateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Verifica que el encabezado exista
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado o formato incorrecto.' });
  }

  // Extrae el token
  const token = authHeader.split(' ')[1];

  try {
    // Verifica el token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Agrega el usuario decodificado al objeto de la solicitud
    next(); // Continúa con la siguiente middleware o controlador
  } catch (error) {
    console.error('Error al verificar el JWT:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

