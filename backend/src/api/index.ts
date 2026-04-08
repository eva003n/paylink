import { server } from "./app";
import { sequelize, connectDb } from "./config/db/postgres";
import { PORT } from "./config/env";
import { connectRedis } from "./config/redis";
import logger from "./logger/logger.winston";

const port = PORT;

const gracefulStartUp = async () => {
  // connect to other services
  await connectDb();
  // connect redis
  await connectRedis();

  process.send?.("ready");// start api process when its connected to external services(db and redis)
  logger.info("Server gracefully started");
};

server.listen(port, async () => {
  await gracefulStartUp();
  logger.info(`Server running at http://localhost:${port}`);
});

// gracefull shutdown
const gracefulShutDown = async () => {
  try {
    // close db connections
    await sequelize.close();

    // process existing requests and do not accept new connections before exit
    server.close(() => {
      logger.info("Server graceful shutdown executed successfully");

      process.exit(0);
    });
  } catch (error) {
    logger.error(`Server graceful shutdown error: ${error.message}`);
    process.exit(1);
  }
};
process.on("SIGINT", gracefulShutDown);
process.on("SIGTERM", gracefulShutDown);
