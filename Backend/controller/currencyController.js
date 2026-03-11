const convertCurrency = require("../Utils/currencyConverter");

exports.convertCurrency = async (req, res) => {
  try {
    const { amount, currency } = req.query;

    if (!amount || !currency) {
      return res.status(400).json({
        success: false,
        message: "Amount and currency required",
      });
    }

    const converted = await convertCurrency(amount, currency);

    res.json({
      success: true,
      amount,
      converted,
      currency,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Currency conversion failed",
    });
  }
};