import IORedis from "ioredis";
import { REDIS_URL } from "../env";
import logger from "../../logger/logger.winston";


let sharedRedisConnection: IORedis | null = null
export  function createConnection(): IORedis {
return new IORedis(REDIS_URL as string, {
  maxRetriesPerRequest: null, // error out faster
  enableReadyCheck: false
});
  
}

export const getSharedConnection = (): IORedis => {
  if(!sharedRedisConnection) {
    sharedRedisConnection = createConnection()
    sharedRedisConnection.on("error", (error) =>
      logger.error(`Bullmq failed to connect to redis: ${error.message}`),
    );
  }
  return sharedRedisConnection

} 

