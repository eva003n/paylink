import { Job, Worker } from "bullmq";
import { getSharedConnection } from "../config/bullmq";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { handleMpesaSTKPush } from "../jobs/payment/processors";
import { PaymentData } from "../jobs/payment/payment.type";
import logger from "../logger/logger.winston";
import { connectDb, sequelize } from "../config/db/postgres";

// connect redis
const connection = getSharedConnection();
// connect postgres
(async() => {
  await connectDb()
})()

const paymentWorker = new Worker(
  QUEUE_NAMES.PAYMENT,
  async (job: Job<PaymentData>) => {
    switch(job.name) {
        case JOB_NAMES.STKPUSH : return handleMpesaSTKPush(job.data)
        default:
             throw new Error(`Unknown payment job: ${job.name}`)
    }
    
  },
  {
    connection: connection.options,
    concurrency: 5, // process upto 5 jobs simultaneously
    limiter: {
      max: 100, // jobs per duration
      duration: 60000, // per 60 seconds
    },
  },
);

// gracefull shutdown of workers(process in flight jobs before exiting)
const shutDown = async () => {
  logger.info(`Gracefully shuting down payment worker`);
  await paymentWorker.close();
  await sequelize.close()
  process.exit(0);
};

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
