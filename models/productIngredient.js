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
  },
  default: { // Nuevo campo para identificar ingredientes por defecto
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false // Los ingredientes no serán por defecto a menos que se indique lo contrario
  }
}, {
  tableName: 'product_ingredient',
  timestamps: true
});

export default ProductIngredient;
