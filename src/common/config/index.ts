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

  /* API configs */
  API_PREFIX: "",

  /* PosgreSQL Credentials */
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,

  SALT_WORK_FACTOR: +process.env.SALT_WORK_FACTOR,
};
