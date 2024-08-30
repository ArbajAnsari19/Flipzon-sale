const Sale = require('../models/Sale');
const Phone = require('../models/Phone');
const Order = require('../models/Order');
const Redis = require('ioredis');
const redisClient = new Redis(process.env.REDIS_URL);

exports.createSale = async (req, res) => {
  try {
    const { productName, totalQuantity, saleStartTime } = req.body;

    const sale = new Sale({
      productName,
      totalQuantity,
      saleStartTime,
    });
    await sale.save();

    // Create phone entries for each stock item
    for (let i = 1; i <= totalQuantity; i++) {
      const phone = new Phone({
        saleId: sale._id,
        productId: `${productName}_${i}`,
      });
      await phone.save();
    }

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAvailablePhone = async (req, res) => {
  try {
    const phone = await Phone.findOne({ pickedUpBy: null, purchasedBy: null });
    if (!phone) {
      return res.status(404).json({ message: 'No available phones' });
    }
    res.json(phone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.pickUpPhone = async (req, res) => {
  const session = await redisClient.multi();
  try {
    const { userId, productId } = req.body;

    // Check if the phone is available
    const phone = await Phone.findOne({ productId, pickedUpBy: null, purchasedBy: null });
    if (!phone) {
      return res.status(400).json({ message: 'Phone not available for pickup' });
    }

    // Update the phone status
    phone.pickedUpBy = userId;
    phone.pickedUpAt = new Date();
    await phone.save();

    // Add the phone to user's cart in Redis
    await session.hset(`cart:${userId}`, productId, JSON.stringify(phone));
    await session.exec();

    res.json({ message: 'Phone picked up successfully', phone });
  } catch (error) {
    await session.discard();
    res.status(500).json({ message: error.message });
  }
};

exports.purchasePhone = async (req, res) => {
  const session = await redisClient.multi();
  try {
    const { userId, productId } = req.body;

    // Check if the phone is in the user's cart
    const phoneString = await redisClient.hget(`cart:${userId}`, productId);
    if (!phoneString) {
      return res.status(400).json({ message: 'Phone not found in cart' });
    }
    const phoneData = JSON.parse(phoneString);

    // Fetch the phone again from the database to get a Mongoose document
    const phone = await Phone.findById(phoneData._id);
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found in database' });
    }

    // Check if the phone has already been purchased
    if (phone.purchasedBy) {
      return res.status(400).json({ message: 'This phone has already been purchased' });
    }

    // Process the purchase
    const order = new Order({
      userId,
      phoneId: phone._id,
      quantity: 1,
    });
    await order.save();

    // Update the phone status
    phone.purchasedBy = userId;
    await phone.save();

    // Remove the phone from user's cart in Redis
    await session.hdel(`cart:${userId}`, productId);
    await session.exec();

    res.json({ message: 'Purchase successful', order });
  } catch (error) {
    await session.discard();
    res.status(500).json({ message: error.message });
  }
};
