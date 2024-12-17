import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const PartnerProducts = sequelize.define('partner_products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'product',
      key: 'id'
    }
  },
  partner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'partner',
      key: 'id'
    }
  }
}, {
  tableName: 'partner_products',
  timestamps: false
});

export default PartnerProducts;