import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const OrderProducts = sequelize.define('order_products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'order',
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
  tableName: 'order_products',
  timestamps: false
});

export default OrderProducts;