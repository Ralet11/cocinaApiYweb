// models/partnerIngredient.js

import { DataTypes } from 'sequelize';
import sequelize from '../database.js';  // Ajusta la ruta a tu archivo de conexión

const PartnerIngredient = sequelize.define('partner_ingredient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  partner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'partner', // Nombre de la tabla, no de la variable
      key: 'id'
    }
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ingredient',
      key: 'id'
    }
  },
  inStock: {
    // Campo booleano para saber si el partner tiene o no este ingrediente
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'partner_ingredient',
  timestamps: true
});

export default PartnerIngredient;
