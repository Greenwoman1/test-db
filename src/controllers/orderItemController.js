const { OrderItem } = require("../models/associations");

const createOrderItem = async (req, res) => {
    try {
        const { orderId, productId, createdAt, updatedAt } = req.body;
        const newOrderItem = await OrderItem.create({ orderId, productId, createdAt, updatedAt });
        res.status(201).json(newOrderItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderItems = async (req, res) => {
    try {
        const orderItems = await OrderItem.findAll({
            attributes: ['id', 'orderId', 'productId', 'createdAt', 'updatedAt'],
            raw: true
        });
        res.status(200).json(orderItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderItemById = async (req, res) => {
    try {
        const orderItemId = req.params.id;
        const orderItem = await OrderItem.findByPk(orderItemId, {
            raw: true
        });
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        res.status(200).json(orderItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderItem = async (req, res) => {
    try {
        const orderItemId = req.params.id;
        const { orderId, productId, createdAt, updatedAt } = req.body;
        const orderItem = await OrderItem.findByPk(orderItemId);
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        await orderItem.update({ orderId, productId, createdAt, updatedAt });
        res.status(200).json({ message: 'Order item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOrderItem = async (req, res) => {
    try {
        const orderItemId = req.params.id;
        const orderItem = await OrderItem.findByPk(orderItemId);
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        await orderItem.destroy();
        res.status(200).json({ message: 'Order item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrderItem,
    getOrderItems,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem
};
