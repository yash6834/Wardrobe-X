import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import ShopContextProvider from "./context/ShopContext.jsx";
import CurrencyProvider from "./context/Currency.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShopContextProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </ShopContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

//  REGISTER SERVICE WORKER (ADD THIS BELOW)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration);
      })
      .catch((error) => {
        console.log("❌ Service Worker registration failed:", error);
      });
  });
}