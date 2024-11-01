const { setAsync, redisClient } = require("../../clients/redisClient");
const { v4: uuidv4 } = require('uuid');

const setCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const newProduct = req.body;

    if (!newProduct) {
      await redisClient.del(userId);
      return res.status(200).json({ message: "Cart cleared successfully" });
    }

    const cartData = await redisClient.get(userId);
    let cart = cartData ? JSON.parse(cartData) : [];

    console.log("Cart data:", JSON.stringify(cart));

    const isSameProduct = (existingProduct, newProduct) => {
      const { id: _, ...existingWithoutId } = existingProduct;
      const { id: __, ...newWithoutId } = newProduct;
    
      return (
        existingWithoutId.productId === newWithoutId.productId &&
        existingWithoutId.variantId === newWithoutId.variantId &&
        JSON.stringify(existingWithoutId.options) === JSON.stringify(newWithoutId.options) &&
        JSON.stringify(existingWithoutId.topons) === JSON.stringify(newWithoutId.topons)
      );
    };
    

    const productIndex = cart.findIndex((item) => isSameProduct(item, newProduct));

    if (productIndex > -1) {
      cart[productIndex].quantity += 1;
    } else {
      cart.push({ ...newProduct, id: uuidv4(), quantity: 1 });
    }

    await redisClient.set(userId, JSON.stringify(cart));

    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: "Error updating cart" });
  }
};




const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartData = await redisClient.get(userId);
    const cart = cartData ? JSON.parse(cartData) : [];

    console.log("Cart data:", JSON.stringify(cart));
    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Error fetching cart" });
  }
};


const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await redisClient.del(userId);
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ message: "Error clearing cart" });
  }
};



module.exports = { setCart , getCart, clearCart };
