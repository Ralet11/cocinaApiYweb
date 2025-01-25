import User from './user.model.js';
import Order from './order.model.js';
import Product from './product.model.js';
import Category from './category.model.js';
import Partner from './partner.model.js';
import CategoryProducts from './categoryProducts.model.js';
import OrderProducts from './orderProducts.model.js';
import PartnerProducts from './partnerProducts.model.js';
import Ingredient from './ingredients.model.js';
import ProductIngredient from './productIngredient.js';
import Review from './review.model.js';

// ======================
//   Relaciones
// ======================

// 1. User <-> Order (1:N)
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// 2. Partner <-> Order (1:N)
Partner.hasMany(Order, { foreignKey: 'partner_id' });
Order.belongsTo(Partner, { foreignKey: 'partner_id' });

// 3. Product <-> Category (N:M a través de CategoryProducts)
Product.belongsToMany(Category, {
  through: CategoryProducts,
  foreignKey: 'product_id',
  otherKey: 'category_id',
});
Category.belongsToMany(Product, {
  through: CategoryProducts,
  foreignKey: 'category_id',
  otherKey: 'product_id',
});

// 4. Order <-> Product (N:M a través de OrderProducts)
Order.belongsToMany(Product, {
  through: OrderProducts,
  foreignKey: 'order_id',
  otherKey: 'product_id',
});
Product.belongsToMany(Order, {
  through: OrderProducts,
  foreignKey: 'product_id',
  otherKey: 'order_id',
});

/*
  ADEMÁS de la relación N:M, para poder incluir `OrderProducts` directamente con `include`,
  definimos también la relación 1:N entre Order y OrderProducts:
*/

// Order <-> OrderProducts (1:N)
Order.hasMany(OrderProducts, {
  foreignKey: 'order_id',
  as: 'order_products',
});
OrderProducts.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

// Product <-> OrderProducts (1:N)
Product.hasMany(OrderProducts, {
  foreignKey: 'product_id',
  as: 'product_orders',
});
OrderProducts.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// 5. Partner <-> Product (N:M a través de PartnerProducts)
Partner.belongsToMany(Product, {
  through: PartnerProducts,
  foreignKey: 'partner_id',
  otherKey: 'product_id',
});
Product.belongsToMany(Partner, {
  through: PartnerProducts,
  foreignKey: 'product_id',
  otherKey: 'partner_id',
});

// 6. Product <-> Ingredient (N:M a través de ProductIngredient)
Product.belongsToMany(Ingredient, {
  through: ProductIngredient,
  foreignKey: 'product_id',
  otherKey: 'ingredient_id',
});
Ingredient.belongsToMany(Product, {
  through: ProductIngredient,
  foreignKey: 'ingredient_id',
  otherKey: 'product_id',
});
ProductIngredient.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });
ProductIngredient.belongsTo(Product, { foreignKey: 'product_id' });

// 7. Order <-> Review (1:1)
Order.hasOne(Review, { foreignKey: 'order_id', as: 'reviews' });
Review.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// 8. Partner <-> Review (1:N)
Partner.hasMany(Review, { foreignKey: 'partnerId', as: 'partnerReviews' });
Review.belongsTo(Partner, { foreignKey: 'partnerId', as: 'partner' });

// 9. User <-> Review (1:N)
User.hasMany(Review, { foreignKey: 'userId', as: 'userReviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ======================
//   Exportar modelos
// ======================
export {
  User,
  Order,
  Product,
  Category,
  Partner,
  CategoryProducts,
  OrderProducts,
  PartnerProducts,
  Ingredient,
  ProductIngredient,
  Review,
};
