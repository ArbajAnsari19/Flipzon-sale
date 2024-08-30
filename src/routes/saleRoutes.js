const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.post('/sales', saleController.createSale);
router.get('/phones/available', saleController.getAvailablePhone);
router.post('/phones/pickup', saleController.pickUpPhone);
router.post('/phones/purchase', saleController.purchasePhone);

module.exports = router;