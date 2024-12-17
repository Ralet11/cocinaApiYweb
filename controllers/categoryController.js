
import { Category } from '../models/index.models.js';

const getAllCategorys = async (req, res) => {
  try {
    const records = await Category.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const record = await Category.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'Category no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

const createCategory = async (req, res) => {
  try {
    const newRecord = await Category.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const record = await Category.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'Category no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const record = await Category.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'Category eliminado correctamente' });
    } else res.status(404).json({ error: 'Category no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};

export {
  getAllCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
