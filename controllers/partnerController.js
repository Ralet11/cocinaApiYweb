import { Category, Partner, Product } from '../models/index.models.js';
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
 
    res.json({ closestPartner, distance: minDistance });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el partner más cercano' });
  }
};

// Obtener los productos de un partner específico por ID

const getPartnerProducts = async (req, res) => {
  try {
    const partnerId = req.params.id;

    // Buscar el Partner con sus productos y categorías relacionadas
    const partner = await Partner.findByPk(partnerId, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'img', 'discount', 'description'], // Asegúrate de incluir "description"
          through: { attributes: [] }, // Ignorar atributos de la tabla intermedia
          include: [
            {
              model: Category,
              attributes: ['id', 'name'], // Traer solo los atributos necesarios de las categorías
              through: { attributes: [] } // Ignorar atributos de la tabla intermedia
            }
          ]
        }
      ]
    });

    if (!partner) {
      return res.status(404).json({ error: 'Partner no encontrado' });
    }



    // Verificar si el partner tiene productos
    if (!partner.products || partner.products.length === 0) {
      return res.json({
        partner: partner.name,
        cat: {} // Devolver categorías vacías
      });
    }

    // Agrupar productos por categorías
    const groupedProducts = {};
    partner.products.forEach((product) => {
 
      if (product.categories && product.categories.length > 0) {
        product.categories.forEach((category) => {
          if (!groupedProducts[category.name]) {
            groupedProducts[category.name] = [];
          }
          groupedProducts[category.name].push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            discount: product.discount,
            description: product.description // Asegurarte de que este campo sea incluido
          });
        });
      }
    });

    console.log(groupedProducts, "qui1")
    // Respuesta con el nombre del partner y los productos agrupados
    return res.json({
      partner: partner.name,
      cat: groupedProducts
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los productos del partner' });
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
