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
  }
}, {
  tableName: 'partner',
  timestamps: false
});

export default Partner;