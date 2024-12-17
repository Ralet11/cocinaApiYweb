
import { Partner } from '../models/index.models.js';

//crear un controlador para saber cual es el artner que tiene el addres mas cercano

const getAllPartners = async (req, res) => {
  try {
    const records = await Partner.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

const getPartnerById = async (req, res) => {
  try {
    const record = await Partner.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'Partner no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

const createPartner = async (req, res) => {
  try {
    const newRecord = await Partner.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

const updatePartner = async (req, res) => {
  try {
    const record = await Partner.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'Partner no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

const deletePartner = async (req, res) => {
  try {
    const record = await Partner.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'Partner eliminado correctamente' });
    } else res.status(404).json({ error: 'Partner no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};

export {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner
};
