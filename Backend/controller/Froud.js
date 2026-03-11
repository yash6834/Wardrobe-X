const FraudLog = require("../models/FroudLog");

exports.getFraudLogs = async (req, res) => {
  try {

    const logs = await FraudLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      logs
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fraud logs"
    });
  }
};

