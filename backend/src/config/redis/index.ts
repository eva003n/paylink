import {createClient} from "redis"
import { RedisStore } from "connect-redis"
import logger from "../../logger/logger.winston"

const redisClient =  createClient()

export const redisStore = new RedisStore({
    client: redisClient
})

export const connectRedis = async() => {
    try {
        await redisClient.connect()
    } catch (error) {
        logger.error(`Error connecting to redis: ${error.message}`)
        
    }

}

