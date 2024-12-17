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
    type: DataTypes.STRING(255), // 255 para admitir contraseñas cifradas o largas
    allowNull: false,
    validate: {
      notEmpty: true, // No permite contraseñas vacías
    },
  }
}, {
  tableName: 'user',
  timestamps: false
});

export default User;