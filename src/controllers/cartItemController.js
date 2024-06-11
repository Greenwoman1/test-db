const {CartItem} = require('../models/associations');

const createCartItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        const newCartItem = await CartItem.create({ user_id, product_id });
        res.status(201).json(newCartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            attributes: ['id', 'user_id', 'product_id'],
            raw: true
        });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCartItemById = async (req, res) => {
    try {
        const cartItemId = req.params.id;
        const cartItem = await CartItem.findByPk(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'CartItem not found' });
        }
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const cartItemId = req.params.id;
        const { user_id, product_id } = req.body;
        const cartItem = await CartItem.findByPk(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'CartItem not found' });
        }
        await cartItem.update({ user_id, product_id });
        res.status(200).json({ message: 'CartItem updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const cartItemId = req.params.id;
        const cartItem = await CartItem.findByPk(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'CartItem not found' });
        }
        await cartItem.destroy();
        res.status(200).json({ message: 'CartItem deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCartItem,
    getCartItems,
    getCartItemById,
    updateCartItem,
    deleteCartItem
};
