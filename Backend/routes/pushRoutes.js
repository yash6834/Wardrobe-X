const express = require("express");
const router = express.Router();

// temporary storage (later use DB)
let subscriptions = [];

router.post("/save-subscription", (req, res) => {
  const subscription = req.body;

  subscriptions.push(subscription);

  console.log("📩 Subscription saved:", subscription);

  res.status(201).json({ message: "Subscription saved" });
});

module.exports = { router, subscriptions };