import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

 const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'order', // Nombre de la tabla de pedidos
      key: 'id',
    },
   
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user', // Nombre de la tabla de usuarios
      key: 'id',
    },
    
  },
  partnerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'partner', // Nombre de la tabla de partners
      key: 'id',
    },
  
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true, // Opcional, si no se deja comentario
  },
 
}, {
  tableName: 'reviews', // Nombre de la tabla en la base de datos
  timestamps: true, // Evita las columnas automáticas `createdAt` y `updatedAt` de Sequelize si no las necesitas
});

export default Review;
