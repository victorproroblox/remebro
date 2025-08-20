// src/env.js
const stripSlash = (u) => (u || "").replace(/\/$/, "");

export const API_URL = stripSlash(
  process.env.REACT_APP_API_MYSQL_URL || "https://edumochila-api-mysql.onrender.com/api"
);

export const API_MONGO_URL = stripSlash(
  process.env.REACT_APP_API_MONGO_URL || "https://edumochila-api-mongo.onrender.com"
);

export const PAYPAL_CLIENT_ID =
  process.env.REACT_APP_PAYPAL_CLIENT_ID || "";

export const PAYPAL_CURRENCY =
  process.env.REACT_APP_PAYPAL_CURRENCY || "MXN";
