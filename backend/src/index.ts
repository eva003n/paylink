import { server } from "./app";
import { PORT } from "./config/env";
import logger from "./logger/logger.winston";

const port = PORT;

server.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
