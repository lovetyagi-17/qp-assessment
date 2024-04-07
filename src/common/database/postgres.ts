import config from "../config";
import * as sequelize from "sequelize";

export const dbConfig = new sequelize.Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: "postgres",
    port: +config.DB_PORT,
    pool: {
      min: 0,
      max: 10,
      acquire: 30000,
      idle: 10000,
    },
    logging: config.NODE_ENV === "production" ? false : true,
  }
);

const connectDB = async () => {
  try {
    dbConfig
      .authenticate()
      .then(() => console.info("Posgresql Connected..."))
      .catch((err) => {
        console.error(`authentication error posgresql : ${err.message}`);
      });
  } catch (err) {
    console.error(`connetion error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
