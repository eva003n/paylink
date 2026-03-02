import express from "express";
import {createServer} from "http"
import { clerkMiddleware } from "@clerk/express";
import cookieParser from "cookie-parser";
import cors from "cors"
import helmet from "helmet";
import morganMiddleware from "./logger/morgan";
import { COOKIE_SECRET, CORS_ORIGIN_URLS, NODE_ENV } from "./config/env";

const app = express();

// config app
app.set("env", NODE_ENV);
// handle cross origin requests
app.use(
  cors({
    origin: CORS_ORIGIN_URLS?.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    optionsSuccessStatus: 200,
  }),
);
// add content security policy
app.use(helmet())

// parse cookie header
app.use(cookieParser(COOKIE_SECRET?.split(",")));

// parse request body to json
app.use(express.json())
//parse urlencoded request body with simple structures
app.use(express.urlencoded({extended: false}))
// authentication middleware
app.use(clerkMiddleware())
// http request logging middleware
app.use(morganMiddleware);

/* ---- API endpoints ---- */
import paymentRouter from "./routes/payment.route"
import linkRouter from "./routes/link.route" 

app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/link", linkRouter)

// error handling middleware
import errorHandlerMiddlware from "./middlewares/error.middleware";

app.use(errorHandlerMiddlware)
const server = createServer(app)
export {
    server
}