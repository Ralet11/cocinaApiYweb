import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },rating: {
    type: DataTypes.INTEGER,
    allownull: false,
    validate: {
        min: 1, // Valor mínimo permitido
        max: 5, // Valor máximo permitido
      }
  },
  comentary: {
    type: DataTypes.STRING(600),
    allounull: true,
  },
  order_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model: "order",
        key: "id"
    }
  },
  partner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'partner',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
}, {
  tableName: 'Review',
  timestamps: true
});

export default Review;
