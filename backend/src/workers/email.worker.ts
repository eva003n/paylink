import { Worker } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import logger from "../logger/logger.winston";


const worker = new Worker("emailQueue", async() => {

}, {
    connection: getSharedConnection().options,
    concurrency: 5,
    limiter: {
        max: 100, // 100 email
        duration: 60000 // per minute
    }
})

const shutDown = async() => {
    logger.info("Gracefully shutting down email worker")
    await worker.close()
    process.exit(0)
    
}

process.on("SIGTERM", shutDown)
process.on("SIGINT", shutDown)