const express = require("express");
const router = express.Router();

const {
  trackActivity,
  getRecommended,
  getAlsoBought,

} = require("../controller/activityController");

const { protect } = require("../middlewares/authMiddleware");


router.post("/track", protect, trackActivity);

router.get("/recommended/:productId", protect, getRecommended);

router.get("/also-bought/:productId", getAlsoBought);



module.exports = router;