import Review from '../models/review.model.js';
import Order from '../models/order.model.js';

export const getAllReview = async (req, res) => {
  try {
    const records = await Review.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reviews' });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const record = await Review.findByPk(req.params.id);
    if (record) res.json(record);
    else res.status(404).json({ error: 'Review no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reviews' });
  }
};


export const getUserReviews = async (req, res) => {
  const userId = req.user.id; 

  try {
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        { model: Order, as: 'order' },
        { model: Partner, as: 'partner' },
      ],
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las reviews.' });
  }
};


export const getPartnerReviews = async (req, res) => {
  const { partnerId } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { partnerId },
      include: [{ model: User, as: 'user' }], // Incluir detalles del usuario
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las reviews del partner.' });
  }
};




export const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user.id; // Extraer el userId del token decodificado
  const { orderId } = req.params;


  try {
    // Verificar si el pedido existe y pertenece al usuario
    const order = await Order.findOne({ where: { id: orderId, userId } });

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado o no pertenece al usuario.' });
    }

    // Verificar si el pedido ya tiene una review
    const existingReview = await Review.findOne({ where: { orderId } });

    if (existingReview) {
      return res.status(400).json({ message: 'El pedido ya ha sido calificado.' });
    }

    // Verificar que el pedido esté completado
    if (order.status !== 'finalizada') {
      return res.status(400).json({ message: 'Solo se pueden calificar pedidos completados.' });
    }

    // Crear la review
    const review = await Review.create({
      orderId,
      userId,
      partnerId: order.partnerId, // Asociar el partner del pedido
      rating,
      comment,
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear la review.' });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id; // Verificar autenticación

  try {
    const review = await Review.findOne({ where: { id, userId } });

    if (!review) {
      return res.status(404).json({ message: 'Review no encontrada o no pertenece al usuario.' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    return res.status(200).json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar la review.' });
    }
  }

export const deleteReview = async (req, res) => {
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

//endponit para obtener todas las reviews de un partner
export const getAllReviewPartner = async (req,res) => {
    try {
        const record = await Review.findAll({where: {
            partner_id : req.params.id
        }})
       res.status(200).json(record) 
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar Review' });
      }
};

