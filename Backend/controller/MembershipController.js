const MembershipPlan = require("../models/Membership");
const User = require("../models/Registration");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

/* =====================================================
   ADMIN: CREATE MEMBERSHIP PLAN
===================================================== */
exports.createPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      durationInDays: Number(req.body.durationInDays),
      discountPercent: Number(req.body.discountPercent),
      order: Number(req.body.order || 0),
    });

    res.status(201).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("CREATE PLAN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create membership plan",
    });
  }
};

/* =====================================================
   ADMIN: GET ALL PLANS
===================================================== */
exports.getAllPlansAdmin = async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ order: 1 });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
    });
  }
};

/* =====================================================
   USER: GET ACTIVE PLANS
===================================================== */
exports.getActivePlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ status: "active" }).sort({ order: 1 });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active plans",
    });
  }
};

/* =====================================================
   ADMIN: UPDATE PLAN
===================================================== */
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPlan = await MembershipPlan.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        durationInDays: Number(req.body.durationInDays),
        discountPercent: Number(req.body.discountPercent),
      },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.json({
      success: true,
      plan: updatedPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update plan",
    });
  }
};

/* =====================================================
   ADMIN: TOGGLE PLAN STATUS
===================================================== */
exports.togglePlanStatus = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    plan.status = plan.status === "active" ? "inactive" : "active";
    await plan.save();

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle plan status",
    });
  }
};

/* =====================================================
   ADMIN: REORDER PLANS (DRAG & DROP)
===================================================== */
exports.reorderMembershipPlans = async (req, res) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const bulkOps = orders.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await MembershipPlan.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: "Membership plans reordered",
    });
  } catch (error) {
    console.error("REORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reorder plans",
    });
  }
};

/* =====================================================
   USER: CREATE RAZORPAY ORDER
===================================================== */
exports.createMembershipPaymentOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await MembershipPlan.findById(planId);
    if (!plan || plan.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Membership plan not available",
      });
    }

    const order = await razorpay.orders.create({
      amount: plan.price * 100, // INR → paise
      currency: "INR",
      receipt: `membership_${plan._id}`,
    });

    res.json({
      success: true,
      order,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

/* =====================================================
   USER: VERIFY PAYMENT & SAVE MEMBERSHIP
===================================================== */
exports.verifyMembershipPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    // 🔐 Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 🔍 Fetch plan
    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    // 👤 Fetch user
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can buy membership",
      });
    }

    // ❌ Deactivate old memberships
    user.memberships.forEach((m) => {
      m.isActive = false;
    });

    // 📅 Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    // ➕ Save membership in ARRAY
    user.memberships.push({
      membershipPlan: plan._id,
      planName: plan.name,
      pricePaid: plan.price,
      durationInDays: plan.durationInDays,
      discountPercent: plan.discountPercent,
      startDate,
      endDate,
      isActive: true,
      paymentId: razorpay_payment_id,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Membership activated successfully",
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Membership activation failed",
    });
  }
};


/* ================= DELETE (IMPORTANT) ================= */
exports.deleteMembership = async (req, res) => {
  try {
    console.log("DELETE MEMBERSHIP ID:", req.params.id);

    const deletedPlan = await MembershipPlan.findByIdAndDelete(req.params.id);

    if (!deletedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE MEMBERSHIP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



