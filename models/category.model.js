import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
}, {
  tableName: 'category',
  timestamps: true
});

export default Category;