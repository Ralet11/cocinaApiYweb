import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Address = sequelize.define('address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
  },
  street: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('home', 'work', 'other'),
    allowNull: false,
    defaultValue: 'other',
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  apartNumb: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'address',
  timestamps: true,
});

export default Address;
