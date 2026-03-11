const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getHeroRecommendations } = require("../controller/RecomendationProduct");
const router = express.Router();
/* 
router.get("/hero", protect, getHeroRecommendations);

router.get("/recent", protect, getRecentViews);
 */
router.get("/hero", protect, getHeroRecommendations);

module.exports = router;