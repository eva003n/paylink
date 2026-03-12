import {createClient} from "redis"
import { RedisStore } from "connect-redis"
import logger from "../../logger/logger.winston"

export const redisClient =  createClient()

export const redisStore = new RedisStore({
    client: redisClient
})

export const connectRedis = async() => {
    try {
        await redisClient.connect()
        logger.info("Successfully connected to redis")
    } catch (error) {
        logger.error(`Error connecting to redis: ${error.message}`)
        
    }

}

