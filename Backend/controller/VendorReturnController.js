const Return = require("../models/Return");

/* ===== VENDOR: VIEW RETURNS ===== */
exports.getVendorReturns = async (req, res) => {
  try {
    const returns = await Return.find()
      .populate({
        path: "items.product",
        select: "vendor name image"
      })
      .populate("orderId");

    const filtered = returns.filter((r) =>
      r.items.some(
        (i) =>
          i.product &&
          i.product.vendor &&
          i.product.vendor.toString() === req.user._id.toString()
      )
    );

    res.json(filtered);
  } catch (err) {
    console.error("Get Vendor Returns Error:", err);
    res.status(500).json({ message: "Failed to fetch vendor returns" });
  }
};

/* ===== VENDOR: REVIEW RETURN (FIXED) ===== */
exports.vendorReviewReturn = async (req, res) => {
  try {
    const { action, remark } = req.body;

    if (!["approved", "rejected"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Invalid action" });
    }

    const rma = await Return.findById(req.params.id)
      .populate({
        path: "items.product",
        select: "vendor",
      });

    if (!rma) {
      return res.status(404).json({ message: "Return not found" });
    }

    // Vendor ownership check
    const owns = rma.items.some(
      (i) =>
        i.product.vendor.toString() ===
        req.user._id.toString()
    );

    if (!owns) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    /* ================= CORE FIX ================= */
    rma.vendorStatus = action;

    // 🔥 THIS IS WHAT MAKES ADMIN SEE IT
    rma.status =
      action === "approved"
        ? "vendor_approved"
        : "vendor_rejected";

    rma.vendorRemark = remark;

    rma.timeline.push({
      status: rma.status,
      message: remark || `Vendor ${action} the return`,
      date: new Date(),
    });

    await rma.save();
    res.json(rma);
  } catch (err) {
    console.error("Vendor Review Error:", err);
    res.status(500).json({ message: "Failed to review return" });
  }
};
