import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const User = sequelize.define('user', {
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
    type: DataTypes.DATE,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
  },
  resetToken: {
    type: DataTypes.STRING, // Almacena el token de recuperación
    allowNull: true
},
  resetTokenExpiration: {
    type: DataTypes.DATE, // Almacena la fecha de expiración del token
    allowNull: true
}
}, {
  tableName: 'user',
  timestamps: true
});

export default User;
