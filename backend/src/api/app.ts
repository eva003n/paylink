import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morganMiddleware from "../logger/morgan";
import { COOKIE_SECRET, CORS_ORIGIN_URLS, NODE_ENV } from "../config/env";
import rateLimit from "express-rate-limit";

const app = express();

// config app
app.set("env", NODE_ENV);
app.set("trust procy", 1)

// handle cross origin requests
app.use(
  cors({
    origin: CORS_ORIGIN_URLS?.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    optionsSuccessStatus: 200,
  }),
);

// rate limit reqyest
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15min
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
  }),
);
// add content security policy
app.use(helmet());

// parse cookie header
app.use(cookieParser(COOKIE_SECRET?.split(",")));

// parse request body to json
app.use(
  express.json({
    limit: "16kb",
  }),
);
//parse urlencoded request body with simple structures
app.use(express.urlencoded({ extended: false }));

import { getAbsolutePath } from "../utils";
app.use(express.static(getAbsolutePath("../../public", __dirname)))
app.use(morganMiddleware);

/* ---- API endpoints ---- */
import authRouter from "./routes/auth.route";
import linkRouter from "./routes/links.route"
import paymentRouter from "./routes/payments.route";
import userRouter from "./routes/user.route"
import analyticRouter from "./routes/analytics.route"

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/links", linkRouter)
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/analytics", analyticRouter);

// bullmq ui endpoint
import { serverAdapter } from "../queues";
app.use("/admin/queues", serverAdapter.getRouter())


import notFoundRouter from "./routes/404.routes";
// error handling middleware
import errorHandlerMiddleware from "./middlewares/error.middleware";

app.use(notFoundRouter);
app.use(errorHandlerMiddleware);
const server = createServer(app);
export { server };
