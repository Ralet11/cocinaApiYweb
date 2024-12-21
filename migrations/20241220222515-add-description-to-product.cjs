'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('product', 'description', {
      type: Sequelize.STRING(600),
      allowNull: true, // Permitir nulos inicialmente
      defaultValue: null, // Valor por defecto
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('product', 'description');
  }
};
