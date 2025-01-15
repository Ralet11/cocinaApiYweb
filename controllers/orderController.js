
import { Order, Product } from '../models/index.models.js';
import OrderProducts from '../models/orderProducts.model.js'

const getAllOrders = async (req, res) => {
  try {
    const records = await Order.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const record = await Order.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'Order no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

export const getAllOrdersByUser = async (req, res) => {
  const { userId } = req.params; 
  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderProducts,
          as: 'order_products',
    
          include: [
            {
              model: Product,
              as: 'product',
            }
          ],
        }
      ],
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ error: 'Error fetching user orders' });
  }
};
function unifyItems(items) {
  const groupedMap = {};

  items.forEach((item) => {
    // Creamos una key en base a la “combinación” de extras
    // Podrías incluir más campos si te interesa, como 'option', etc.
    const extrasKey = JSON.stringify({
      productId: item.productId,
      includedIngredients: item.includedIngredients,
      extraIngredients: item.extraIngredients
    });

    if (groupedMap[extrasKey]) {
      // Si ya existe, sumamos cantidades y precios
      groupedMap[extrasKey].quantity += item.quantity;
      groupedMap[extrasKey].totalPrice += item.totalPrice;
    } else {
      // Creamos la entrada
      groupedMap[extrasKey] = { ...item };
    }
  });

  return Object.values(groupedMap);
}

// En tu createOrder
const createOrder = async (req, res) => {
  try {
    const { items, ...rest } = req.body;

    // 1) Crear la orden
    const newOrder = await Order.create({ ...rest });

    // 2) Unificar ítems con la misma configuración
    const unifiedItems = unifyItems(items);

    // 3) Crear los productos en la tabla
    const orderProducts = unifiedItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.totalPrice,
      extras: {
        includedIngredients: item.includedIngredients,
        extraIngredients: item.extraIngredients
      }
    }));
    
    await OrderProducts.bulkCreate(orderProducts);

    // 4) Responder
    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
      orderProducts,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};


const updateOrder = async (req, res) => {
  try {
    const record = await Order.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'Order no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const record = await Order.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'Order eliminado correctamente' });
    } else res.status(404).json({ error: 'Order no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};

export {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
