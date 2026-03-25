import { Sequelize } from "sequelize";
import logger from "../../logger/logger.winston";
import { POSTGRES_URL } from "../env";

export const sequelize = new Sequelize(POSTGRES_URL as string,{
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

