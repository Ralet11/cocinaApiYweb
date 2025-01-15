module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'order_products', // Nombre de la tabla
      'order_products_order_id_product_id_key' // Nombre de la constraint
    );
  },

  async down(queryInterface, Sequelize) {
    // Para revertir el cambio, vuelves a agregar la constraint de unicidad
    await queryInterface.addConstraint('order_products', {
      fields: ['order_id', 'product_id'], // Columnas afectadas
      type: 'unique', // Tipo de constraint
      name: 'order_products_order_id_product_id_key' // Nombre de la constraint
    });
  },
};
