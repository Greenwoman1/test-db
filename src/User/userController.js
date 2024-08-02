

const { Order, OrderItem, PriceHistory, Variant, User, Option, Topon } = require('../.');

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const newUser = await User.create({ firstName, lastName, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName'],
      raw: true
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ firstName, lastName });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getOrderDetailsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.findAll({
      where: { UserId: userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Variant,
              include: [
                {
                  model: PriceHistory,
                  where: {
                    itemType: 'Variant'
                  },
                  required: false
                }
              ]
            },
            {
              model: Option,
              through: { attributes: [] },

            },
            {
              model: Topon,
              through: { attributes: [] },
            
            }
          ]
        }
      ]
    });

    const detailedOrders = orders.map(order => {
      const orderDetails = {
        orderId: order.id,
        locationId: order.locationId,
        totalPrice: order.totalPrice,
        status: order.status,
        products: order.OrderItem.map(item => {
          const variant = item.Variant;
          const variantPrice = variant.Prices.length ? variant.Prices[0].price : 0;

          const options = item.Options.map(option => {
            return {
              id: option.id,
              name: option.name,
            };
          });
          const topons = item.Topon.map(topon => {
            const toponPrice = topon.Prices.length ? topon.Prices[0].price : 0;
            return {
              id: topon.id,
              name: topon.name,
              price: toponPrice
            };
          });

          const totalItemPrice = (parseFloat(variantPrice) + topons.reduce((sum, top) => sum + parseFloat(top.price), 0)) * item.quantity;

          return {
            productId: item.ProductId,
            variant: {
              id: variant.id,
              name: variant.name,
              price: variantPrice
            },
            options,
            topons,
            quantity: item.quantity,
            totalItemPrice
          };
        })
      };
      return orderDetails;
    });

    res.status(200).json(detailedOrders);
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getOrderDetailsForUser
};
