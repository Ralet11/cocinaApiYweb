
import { PartnerProducts } from '../models/index.models.js';

const getAllPartnerProductses = async (req, res) => {
  try {
    const records = await PartnerProducts.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

const getPartnerProductsById = async (req, res) => {
  try {
    const record = await PartnerProducts.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'PartnerProducts no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

const createPartnerProducts = async (req, res) => {
  try {
    const newRecord = await PartnerProducts.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

const updatePartnerProducts = async (req, res) => {
  try {
    const record = await PartnerProducts.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'PartnerProducts no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

const deletePartnerProducts = async (req, res) => {
  try {
    const record = await PartnerProducts.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'PartnerProducts eliminado correctamente' });
    } else res.status(404).json({ error: 'PartnerProducts no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};

export {
  getAllPartnerProductses,
  getPartnerProductsById,
  createPartnerProducts,
  updatePartnerProducts,
  deletePartnerProducts
};
