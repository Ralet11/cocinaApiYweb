module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('order', 'status', {
      type: Sequelize.ENUM('pendiente', 'aceptada', 'envio', 'finalizada'),
      allowNull: false,
      defaultValue: 'pendiente',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('order', 'status');

    // To clean up ENUM type in PostgreSQL after removing the column
    if (queryInterface.sequelize.options.dialect === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS \"enum_order_status\";');
    }
  }
};
