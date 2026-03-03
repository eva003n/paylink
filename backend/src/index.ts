import { server } from "./app";
import { sequelize } from "./config/db/postgres";
import { PORT } from "./config/env";
import logger from "./logger/logger.winston";

const port = PORT;

server.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});


// gracefull shutdown
process.on("SIGINT", async() => {
  try {
    // close db connections
    await sequelize.close();

    // process existing requests and do not accept new connections before exit
    process.exit(0);
  } catch (error) {
    logger.error(`Gracefull shutdown error: ${error.message}`)
    process.exit(1);
    
  }


})