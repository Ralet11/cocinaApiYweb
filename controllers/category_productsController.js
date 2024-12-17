
import { CategoryProducts } from '../models/index.models.js';

const getAllCategoryProductses = async (req, res) => {
  try {
    const records = await CategoryProducts.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

const getCategoryProductsById = async (req, res) => {
  try {
    const record = await CategoryProducts.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'CategoryProducts no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

const createCategoryProducts = async (req, res) => {
  try {
    const newRecord = await CategoryProducts.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

const updateCategoryProducts = async (req, res) => {
  try {
    const record = await CategoryProducts.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'CategoryProducts no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

const deleteCategoryProducts = async (req, res) => {
  try {
    const record = await CategoryProducts.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'CategoryProducts eliminado correctamente' });
    } else res.status(404).json({ error: 'CategoryProducts no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};

export {
  getAllCategoryProductses,
  getCategoryProductsById,
  createCategoryProducts,
  updateCategoryProducts,
  deleteCategoryProducts
};
