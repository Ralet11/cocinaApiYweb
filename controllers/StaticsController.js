import { Order, Review, OrderProducts, PartnerProducts } from '../models/index.models.js'; // Importa tus modelos
import sequelize from 'sequelize';

export const getPartnerStatistics = async (req, res) => {
    const partnerId = req.user.id;
  
    try {
      // 1. Resumen de Pedidos
      const orders = await Order.findAll({ where: { partner_id: partnerId } });
      const totalOrders = orders.length;
  
      const ordersByStatus = orders.reduce((acc, order) => {  //acc es el acumulador que se va llenado por cada iteracion
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
  
      // 2. Finanzas
      const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.finalPrice) || 0), 0);
      const totalDeliveryFees = orders.reduce((sum, order) => sum + (parseFloat(order.deliveryFee) || 0), 0);
      const averageRevenuePerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
      // 3. Opiniones y Calificaciones
      const reviews = await Review.findAll({ where: { partnerId: partnerId } });
      const totalReviews = reviews.length;
  
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + (parseInt(review.rating) || 0), 0) / totalReviews 
        : 0;
  
      const recentComments = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  
      // 4. Productos más Vendidos
      const orderProducts = await OrderProducts.findAll({
        where: { order_id: orders.map(order => order.id) } // Filtra por los IDs de los pedidos
      });
  
      const productSales = orderProducts.reduce((acc, orderProduct) => {
        acc[orderProduct.product_id] = (acc[orderProduct.product_id] || 0) + orderProduct.quantity;
        return acc;
      }, {});
  
      const topProducts = Object.entries(productSales)
        .map(([productId, totalQuantity]) => ({ productId, totalQuantity }))
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5); // Muestra los 5 productos más vendidos
  
      
  
      // Compilar todas las estadísticas
      const statistics = {
        totalOrders,
        ordersByStatus,
        totalRevenue,
        totalDeliveryFees,
        averageRevenuePerOrder,
        averageRating,
        totalReviews,
        recentComments,
        topProducts,
      };
  
      res.json(statistics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener estadísticas del partner' });
    }
  };