import Ingredient from "../models/ingredients.model.js"
import ProductIngredient from "../models/productIngredient.js"

export const getAll = async (req, res) => {
    try {
        const ingredients = await Ingredient.findAll()
        res.status(200).json(ingredients)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getByProductId = async (req, res) => {
  const { id } = req.params;
  try {
    const productIngredients = await ProductIngredient.findAll({
      where: { product_id: id },
      include: [{
        model: Ingredient,
        attributes: ['id', 'name', 'price']
      }]
    });

    // Combinar la info del ingrediente con el valor de `default` del ProductIngredient
    const ingredients = productIngredients.map(pi => {
      return {
        ...pi.ingredient.dataValues,
        included: pi.default // Aquí renombramos `default` a `included` en la respuesta
      };
    });

    res.status(200).json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo ingredientes' });
  }
};