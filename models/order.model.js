import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  deliveryAddress: {
    type: DataTypes.STRING(145),
    allowNull: true
  },
  code: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  partner_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'partner',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  finalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'aceptada', 'envio', 'finalizada'),
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'order',
  timestamps: true
});


export default Order;
