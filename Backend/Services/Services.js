import axios from "axios";

export const getExchangeRates = async () => {
  try {
    const response = await axios.get("https://open.er-api.com/v6/latest/INR");
    return response.data.rates;
  } catch (error) {
    console.error("Exchange rate fetch failed:", error);
    return null;
  }
};