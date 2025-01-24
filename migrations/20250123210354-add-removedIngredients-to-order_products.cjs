'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('order_products', 'removedIngredients', {
      type: Sequelize.JSON,
      allowNull: true, // Permite valores nulos
      defaultValue: null, // Valor por defecto para nuevos registros
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('order_products', 'removedIngredients');
  },
};
