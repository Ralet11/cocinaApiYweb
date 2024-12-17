
import { Product } from '../models/index.models.js';

const getAllProducts = async (req, res) => {
  try {
    const records = await Product.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

const getProductById = async (req, res) => {
  try {
    const record = await Product.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'Product no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

const createProduct = async (req, res) => {
  try {
    const newRecord = await Product.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const record = await Product.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'Product no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const record = await Product.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'Product eliminado correctamente' });
    } else res.status(404).json({ error: 'Product no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
