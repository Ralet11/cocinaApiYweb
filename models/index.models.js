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
  otherKey: 'category_id',
});
Category.belongsToMany(Product, {
  through: CategoryProducts,
  foreignKey: 'category_id',
  otherKey: 'product_id',
});

// Order - Product (Muchos a muchos)
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

// Partner - Product (Muchos a muchos)
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

// Product - Ingredient (Muchos a muchos)
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

// Review - Order
Order.hasOne(Review, { foreignKey: 'order_id', as: 'reviews' }); // Relación corregida
Review.belongsTo(Order, { foreignKey: 'order_id', as: 'order' }); // Relación corregida

// Relación entre Review y Partner (un partner puede tener muchas reviews)
Partner.hasMany(Review, { foreignKey: 'partnerId', as: 'partnerReviews' }); // Alias modificado
Review.belongsTo(Partner, { foreignKey: 'partnerId', as: 'partner' });

// Relación entre Review y User (un usuario puede tener muchas reviews)
User.hasMany(Review, { foreignKey: 'userId', as: 'userReviews' }); // Alias modificado
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });



// Exportar todos los modelos
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