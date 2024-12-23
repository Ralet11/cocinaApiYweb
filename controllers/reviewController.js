import Review from "../models/review.model.js";


const getAllReview = async (req, res) => {
  try {
    const records = await Review.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reviews' });
  }
};

const getReviewById = async (req, res) => {
  try {
    const record = await Review.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'Review no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reviews' });
  }
};

const createReview = async (req, res) => {
  try {
    const newRecord = await Review.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear review' });
  }
};

const updateReview = async (req, res) => {
  try {
    const record = await Review.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else res.status(404).json({ error: 'Reviews no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar reviews' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const record = await Review.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: 'Review eliminado correctamente' });
    } else res.status(404).json({ error: 'Review no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar Review' });
  }
};

const getAllReviewPartner = async (req,res) => {
    try {
        const record = await Review.findAll({where: {
            partner_id : req.params.id
        }})
       res.status(200).json(record) 
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar Review' });
      }
};

export {
  getAllReview,
  deleteReview,
  getReviewById,
  createReview,
  updateReview,
  getAllReviewPartner
};