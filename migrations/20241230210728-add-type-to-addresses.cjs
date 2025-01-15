'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('address', 'type', {
      type: Sequelize.ENUM('home', 'work', 'other'),
      allowNull: false,
      defaultValue: 'other'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('address', 'type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_addresses_type";'); // Limpia el ENUM
  }
};
