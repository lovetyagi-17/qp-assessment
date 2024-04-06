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

  /* API configs */
  API_PREFIX: "",

  MONGO_URI: process.env.MONGO_URI,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_NAME: process.env.MONGO_NAME,
};
