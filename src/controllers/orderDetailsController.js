const {OrderDetails} = require('../models/associations');

const createOrderDetails = async (req, res) => {
    try {
        const { userId, total, paymentId } = req.body;
        const newOrderDetails = await OrderDetails.create({ userId, total, paymentId });
        res.status(201).json(newOrderDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const orders = await OrderDetails.findAll({
            attributes: ['id', 'userId', 'total', 'paymentId', 'createdAt', 'updatedAt'],
            raw: true
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderDetailsById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderDetails.findByPk(orderId, {
            raw: true
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { userId, total, paymentId } = req.body;
        const order = await OrderDetails.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.update({ userId, total, paymentId });
        res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderDetails.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.destroy();
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrderDetails,
    getOrderDetails,
    getOrderDetailsById,
    updateOrderDetails,
    deleteOrderDetails
};
