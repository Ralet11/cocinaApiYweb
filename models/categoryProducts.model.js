import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const CategoryProducts = sequelize.define('category_products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'category',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'product',
      key: 'id'
    }
  }
}, {
  tableName: 'category_products',
  timestamps: false
});

export default CategoryProducts;
