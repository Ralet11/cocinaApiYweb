
import { Order } from '../models/index.models.js';

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

const createOrder = async (req, res) => {
  try {
    const newRecord = await Order.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro' });
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
