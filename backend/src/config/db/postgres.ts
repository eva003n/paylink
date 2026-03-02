import { Sequelize } from "Sequelize";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../env";
import { tryCatch } from "bullmq";
import logger from "../../logger/logger.winston";

export const sequelize = new Sequelize({
  host: DB_HOST as string,
  dialect: "postgres",
  username: DB_USER as string,
  password: DB_PASSWORD as string,
  database: DB_NAME as string,
  port: parseInt(DB_PORT as string),
  logging: logger.info.bind(logger),
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Postgres db connected successfully");
  } catch (err) {
    logger.error(`Error connecting to postgres database: ${err.message}`);
    process.exit(1);
  }
};

