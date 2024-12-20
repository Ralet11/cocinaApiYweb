import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const ProductIngredient = sequelize.define('product_ingredient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ingredient',
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
  tableName: 'product_ingredient',
  timestamps: true
});

export default ProductIngredient;
