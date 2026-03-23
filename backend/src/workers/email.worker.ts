import { Worker, Job } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import logger from "../logger/logger.winston";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { handleEmail } from "../jobs/email/processor";
import { EmailData } from "../jobs/email/email.types";


const worker = new Worker(QUEUE_NAMES.EMAIL, async(job: Job<EmailData>) => {

switch (job.name) {
  case JOB_NAMES.RECEIPT_EMAIL:
    return await handleEmail(job.data);

  default:
    throw new Error(`Unknown job in email worker: ${job.name}`);
}
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