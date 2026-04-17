import { Queue } from "bullmq";
import { JOB_NAMES, QUEUE_NAMES } from "../constants";
import { createRedisConnection } from "../config/redis";
import { LinkExpiry } from "../../schemas/validators";

export const linkQueue = new Queue(QUEUE_NAMES.Link, {
  connection: createRedisConnection().options,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

// handle payment link expiry
export const enqueueLinkExpired = async (linkData: LinkExpiry) => {
return await linkQueue.add(JOB_NAMES.LINK_EXPIRED, linkData, {
  jobId: linkData.linkId,
  delay: linkData.delay // expire link
})
}