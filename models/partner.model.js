import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Partner = sequelize.define('partner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(65),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(65),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(65),
    allowNull: false,
    unique: true
  },
  birthdate: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  latitude: {
    type: DataTypes.FLOAT, // Almacenará la latitud en formato de punto flotante
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT, // Almacenará la longitud en formato de punto flotante
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255), // Nuevo campo para almacenar direcciones
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true, // No permite contraseñas vacías
    },
  }
}, {
  tableName: 'partner',
  timestamps: true
});

export default Partner;
