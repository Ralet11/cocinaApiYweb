'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('address', 'lat', {
      type: Sequelize.FLOAT,
      allowNull: true, // Permitir valores nulos si es opcional
      defaultValue: null,
    });
    await queryInterface.addColumn('address', 'lng', {
      type: Sequelize.FLOAT,
      allowNull: true, // Permitir valores nulos si es opcional
      defaultValue: null,
    });
    await queryInterface.addColumn('address', 'apartNumb', {
      type: Sequelize.STRING,
      allowNull: true, // Permitir valores nulos si es opcional
      defaultValue: null,
    });
    await queryInterface.addColumn('address', 'comments', {
      type: Sequelize.STRING,
      allowNull: true, // Permitir valores nulos si es opcional
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('address', 'lat');
    await queryInterface.removeColumn('address', 'lng');
    await queryInterface.removeColumn('address', 'apartNumb');
    await queryInterface.removeColumn('address', 'comments');
  },
};
