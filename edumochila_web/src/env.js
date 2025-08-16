// src/env.js
const stripSlash = (u) => (u || "").replace(/\/$/, "");

export const API_URL = stripSlash(
  process.env.REACT_APP_API_MYSQL_URL || "http://localhost:4000"
);

export const API_MONGO_URL = stripSlash(
  process.env.REACT_APP_API_MONGO_URL || "http://localhost:8001"
);

export const PAYPAL_CLIENT_ID =
  process.env.REACT_APP_PAYPAL_CLIENT_ID || "";

export const PAYPAL_CURRENCY =
  process.env.REACT_APP_PAYPAL_CURRENCY || "MXN";
