import User from './user.model.js';
import Order from './order.model.js';
import Product from './product.model.js';
import Category from './category.model.js';
import Partner from './partner.model.js';
import CategoryProducts from './categoryProducts.model.js';
import OrderProducts from './orderProducts.model.js';
import PartnerProducts from './partnerProducts.model.js';

// Relaciones

// User - Order
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Partner - Order
Partner.hasMany(Order, { foreignKey: 'partner_id' });
Order.belongsTo(Partner, { foreignKey: 'partner_id' });

// Product - Category (Muchos a muchos)
Product.belongsToMany(Category, {
  through: CategoryProducts,
  foreignKey: 'product_id',
  otherKey: 'category_id'
});
Category.belongsToMany(Product, {
  through: CategoryProducts,
  foreignKey: 'category_id',
  otherKey: 'product_id'
});

// Order - Product (Muchos a muchos)
Order.belongsToMany(Product, {
  through: OrderProducts,
  foreignKey: 'order_id',
  otherKey: 'product_id'
});
Product.belongsToMany(Order, {
  through: OrderProducts,
  foreignKey: 'product_id',
  otherKey: 'order_id'
});

// Partner - Product (Muchos a muchos)
Partner.belongsToMany(Product, {
  through: PartnerProducts,
  foreignKey: 'partner_id',
  otherKey: 'product_id'
});
Product.belongsToMany(Partner, {
  through: PartnerProducts,
  foreignKey: 'product_id',
  otherKey: 'partner_id'
});

export {
  User,
  Order,
  Product,
  Category,
  Partner,
  CategoryProducts,
  OrderProducts,
  PartnerProducts
};
