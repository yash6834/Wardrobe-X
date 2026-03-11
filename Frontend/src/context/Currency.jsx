import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {

  const [currency, setCurrencyState] = useState(
    localStorage.getItem("currency") || "INR"
  );

  const [rates, setRates] = useState({});

  const setCurrency = (newCurrency) => {
    localStorage.setItem("currency", newCurrency);
    setCurrencyState(newCurrency);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await axios.get("https://open.er-api.com/v6/latest/INR");
      setRates(res.data.rates);
    } catch (err) {
      console.log("Currency API error");
    }
  };

  const convertPrice = (price) => {
    if (!rates[currency]) return price;
    return (price * rates[currency]).toFixed(2);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;