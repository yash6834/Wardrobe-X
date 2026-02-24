const express = require("express");
const router = express.Router();

const {
  trackActivity,
  getRecommended,
  getAlsoBought,
  getPopular
} = require("../controller/activityController");

const { protect } = require("../middlewares/authMiddleware");


router.post("/track", protect, trackActivity);

router.get("/recommended/:productId", protect, getRecommended);

router.get("/also-bought/:productId", getAlsoBought);

router.get("/popular", getPopular);


module.exports = router;