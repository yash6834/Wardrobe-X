import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [rates, setRates] = useState({});

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get("https://open.er-api.com/v6/latest/INR");
        setRates(res.data.rates);
      } catch (error) {
        console.error("Currency API error:", error);
      }
    };

    fetchRates();
  }, []);

  const convertPrice = (price) => {
    if (!rates[currency]) return price;
    return (price * rates[currency]).toFixed(2);
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convertPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;