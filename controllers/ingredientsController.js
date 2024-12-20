import ProductIngredient from "../models/productIngredient"

export const getByProductId = async (req, res) => {
    const {id} = req.params
    try {
        const ingredients = await ProductIngredient.findAll({where: {product_id: id}})
        res.status(200).json(ingredients)

    } catch (error) {
        res.status(500).json(error)
    }
}