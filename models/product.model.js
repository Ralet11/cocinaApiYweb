import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  img: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING(600),
    allowNull: true
  },
    stock: {
    type: DataTypes.INTEGER(),
    allowNull: false,
    validate: {
    min: 0, // Valida que el valor mínimo sea 0
  },
  } 
}, {
  tableName: 'product',
  timestamps: true
});

export default Product;

