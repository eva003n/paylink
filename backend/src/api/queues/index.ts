import { paymentQueue } from "./payment.queue";
import { pdfQueue } from "./pdf.queue";
import { emailQueue } from "./email.queue";
import { enqueueSTKPush, enqueueSTKPoll } from "./payment.queue";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
// import { privateRoute, protectRoute } from "../api/middlewares/auth.middleware";
import { NODE_ENV } from "../config/env";

//bull board
/*
 * Read article for setup guidance
 * https://oneuptime.com/blog/post/2026-01-21-bullmq-bull-board/view#dynamic-queue-registration
 */
const serverAdapter = new ExpressAdapter();
// get router
const bullBoardRouter = serverAdapter.getRouter();
serverAdapter.setBasePath("/admin/queues");
// pauthentication and authorization(Only admin can access routes)
// bullBoardRouter.use(protectRoute)
// bullBoardRouter.use(privateRoute)

const readOnly = NODE_ENV === "production";
createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue, { readOnlyMode: readOnly }),
    new BullMQAdapter(paymentQueue, { readOnlyMode: readOnly }),
    new BullMQAdapter(pdfQueue, { readOnlyMode: readOnly }),
  ],
  serverAdapter,
});

export {
  emailQueue,
  paymentQueue,
  pdfQueue,
  enqueueSTKPush,
  enqueueSTKPoll,
  bullBoardRouter,
  serverAdapter,
};
