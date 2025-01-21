'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar la columna "password" a la tabla "partner"
    await queryInterface.addColumn('partner', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true, // No permite contraseñas vacías
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir el cambio eliminando la columna "password"
    await queryInterface.removeColumn('partner', 'password');
  }
};