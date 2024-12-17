import { Partner, Product } from '../models/index.models.js';
import { getDistance } from 'geolib';

// Obtener todos los partners
const getAllPartners = async (req, res) => {
  try {
    const records = await Partner.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros' });
  }
};

// Obtener un partner por ID
const getPartnerById = async (req, res) => {
  try {
    const record = await Partner.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'Partner no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

// Crear un nuevo partner
const createPartner = async (req, res) => {
  try {
    const newRecord = await Partner.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

// Actualizar un partner existente
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

// Eliminar un partner
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

// Obtener el partner más cercano utilizando geolib
const getClosestPartner = async (req, res) => {
  const { latitude, longitude } = req.body.address;
  console.log(req.body, "Body")
  const lat = latitude
  const lng = longitude



  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
  }

  try {
    const partners = await Partner.findAll();

    if (partners.length === 0) {
      return res.status(404).json({ error: 'No se encontraron partners' });
    }

    let closestPartner = null;
    let minDistance = Infinity;

    for (const partner of partners) {
      const distance = getDistance(
        { latitude: lat, longitude: lng },
        { latitude: partner.latitude, longitude: partner.longitude }
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestPartner = partner;
      }
    }
    console.log(closestPartner)
    res.json({ closestPartner, distance: minDistance });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el partner más cercano' });
  }
};

// Obtener los productos de un partner específico por ID
const getPartnerProducts = async (req, res) => {
  try {
    const partnerId = req.params.id;
    const partner = await Partner.findByPk(partnerId, {
      include: [{ model: Product }],
    });

    if (!partner) {
      return res.status(404).json({ error: 'Partner no encontrado' });
    }

    res.json({ partner: partner.name, products: partner.Products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos del partner' });
  }
};

export {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getClosestPartner,
  getPartnerProducts,
};
