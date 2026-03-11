const { convertCurrency } = require ("../controller/currencyController");
const express = require("express");
const router = express.Router();

router.get("/convert", convertCurrency);

module.exports = router;