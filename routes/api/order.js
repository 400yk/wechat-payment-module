const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');

router.route('/')
    .post(orderController.createOrder);

router.route('/checkPay')
    .get(orderController.checkPay);

module.exports = router; 