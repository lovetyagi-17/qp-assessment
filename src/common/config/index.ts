import dotenv from "dotenv";

// This error should crash whole process
const envFound = dotenv.config();
if (!envFound) throw new Error("⚠️ Couldn not find .env file ⚠️");

export default {
  ENV: process.env.ENV,
  NODE_ENV: process.env.NODE_ENV,
  NAME: process.env.NAME,
  VERSION: process.env.VERSION,
  PORT: process.env.PORT,

  /* Ecryption Secret Keys */
  ENC_KEY: process.env.ENC_KEY,
  ENC_IV: process.env.ENC_IV,

  JWT_TTL: process.env.JWT_TTL,
  JWT_SECRET: process.env.JWT_SECRET,
  CIPHER_SECRET: process.env.CIPHER_SECRET,

  /* API configs */
  API_PREFIX: "",

  /* PosgreSQL Credentials */
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,

  SALT_WORK_FACTOR: +process.env.SALT_WORK_FACTOR,

  /* QP admin Credentials */
  QP_ADMIN_EMAIL: process.env.QP_ADMIN_EMAIL,
  QP_ADMIN_PASSWORD: process.env.QP_ADMIN_PASSWORD,

  QP_USER_EMAIL: process.env.QP_USER_EMAIL,
  QP_USER_PASSWORD: process.env.QP_USER_PASSWORD,
};
