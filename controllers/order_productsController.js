
import { OrderProducts, Product } from '../models/index.models.js';

const getAllOrderProductses = async (req, res) => {
  try {
    const records = await OrderProducts.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

 const getOrderProductsById = async (req, res) => {
  try {
    const record = await OrderProducts.findAll({
      where: { order_id: req.params.id },
      include: [
        {
          model: Product,
          as: 'product', // Debe coincidir con el alias definido en la relación
          attributes: ['id', 'name', 'price', 'img', 'discount', 'description'],
        },
      ],
    });

    if (record && record.length > 0) {
      res.json(record);
    } else {
      res.status(404).json({ error: 'OrderProducts no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

const createOrderProducts = async (req, res) => {
  try {
    const newRecord = await OrderProducts.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

const updateOrderProducts = async (req, res) => {
  try {
    const record = await OrderProducts.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'OrderProducts no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

const deleteOrderProducts = async (req, res) => {
  try {
    const record = await OrderProducts.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'OrderProducts eliminado correctamente' });
    } else res.status(404).json({ error: 'OrderProducts no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};

export {
  getAllOrderProductses,
  getOrderProductsById,
  createOrderProducts,
  updateOrderProducts,
  deleteOrderProducts
};
