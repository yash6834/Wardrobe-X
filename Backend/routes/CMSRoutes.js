const express = require("express");
const router = express.Router();
const cmsController = require("../controller/CMSController");
const upload = require("../middlewares/uploads"); // IMPORTANT

router.post(
  "/banner",
  upload.single("image"),   // MUST BE HERE
  cmsController.createBanner
);

router.get("/banner", cmsController.getBanners);

router.put(
  "/banner/:id",
  upload.single("image"),   // MUST BE HERE
  cmsController.updateBanner
);

router.delete("/banner/:id", cmsController.deleteBanner);

module.exports = router;
