// config/jwt.js
export const JWT_SECRET   = process.env.JWT_SECRET || "dev_secret";
export const JWT_ISSUER   = process.env.JWT_ISSUER || "edumochila";
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "edumochila-app";
