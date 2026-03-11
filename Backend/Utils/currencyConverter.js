const { getExchangeRates } = require("../Services/Services");

const convertCurrency = async (amount, currency = "INR") => {
  try {
    if (currency === "INR") {
      return Number(amount);
    }

    const rates = await getExchangeRates();

    if (!rates[currency]) {
      throw new Error("Invalid currency");
    }

    const converted = amount * rates[currency];

    return Number(converted.toFixed(2));
  } catch (error) {
    console.error("Currency conversion error:", error.message);
    return Number(amount);
  }
};

module.exports = convertCurrency;