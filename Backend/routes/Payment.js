const express = require("express");
const { captureDevice } = require("../middlewares/DeviceTracker");
const { createOrder } = require("../controller/Payment");
const { verifyOnlinePayment } = require("../controller/OrderController");
const router = express.Router();

router.post("/payment/create-order", captureDevice, createOrder);



router.post("/payment/verify-payment", captureDevice, verifyOnlinePayment);

module.exports = router;