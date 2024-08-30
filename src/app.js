const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('dotenv').config();
const cron = require('node-cron');
const saleRoutes = require('./routes/saleRoutes');

const app = express();

// Middleware setup
app.use(express.json());
app.use(helmet());
app.use(cors());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI);

// Redis connection for caching
const redisClient = new Redis(process.env.REDIS_URL);

// Routes
app.use('/api', saleRoutes);

// Cron job for resetting picked up phones
cron.schedule('*/1 * * * *', async () => {
  const phones = await Phone.find({
    pickedUpAt: { $lt: new Date(Date.now() - 12 * 60 * 1000) },
    purchasedBy: null
  });

  phones.forEach(async (phone) => {
    phone.pickedUpBy = null;
    phone.pickedUpAt = null;
    await phone.save();
  });
});

// Export the app instead of starting the server
module.exports = app;