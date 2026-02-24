const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getActivePlans,
  getAllPlansAdmin,
  createPlan,
  updatePlan,
  togglePlanStatus,
  reorderMembershipPlans,
  createMembershipPaymentOrder,
  verifyMembershipPayment,
  deleteMembership,
} = require("../controller/MembershipController");

/* USER ROUTES */
router.get("/active", getActivePlans);
router.post("/payment/create-order", protect, createMembershipPaymentOrder);
router.post("/payment/verify", protect, verifyMembershipPayment);

/* ADMIN ROUTES */
router.get("/", protect, adminOnly, getAllPlansAdmin);
router.post("/", protect, adminOnly, createPlan);
router.put("/:id", protect, adminOnly, updatePlan);
router.patch("/:id/status", protect, adminOnly, togglePlanStatus);
router.patch("/reorder", protect, adminOnly, reorderMembershipPlans);

/* DELETE PLAN */
router.delete("/delete/:id", protect, adminOnly, deleteMembership);

module.exports = router;
