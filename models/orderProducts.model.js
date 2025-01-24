import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const OrderProducts = sequelize.define('order_products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'order',
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'product',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  extras: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  removedIngredients: {
      type: DataTypes.JSON,
      allowNull: true, // Permite valores nulos para registros existentes sin ingredientes eliminados
      defaultValue: null, // Por defecto, ningún ingrediente eliminado
    },
}, {
  tableName: 'order_products',
  timestamps: true,
});

export default OrderProducts;
