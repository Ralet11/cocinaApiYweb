import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Ingredient = sequelize.define('ingredient', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(65),
      allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    }
  }, {
    tableName: 'ingredient',
    timestamps: true
  });

  export default Ingredient;
  