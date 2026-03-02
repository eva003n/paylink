import { config } from "dotenv";
import { getAbsolutePath } from "../utils/index";

config({
  path: getAbsolutePath("../../.env"),
});

config({
  path: getAbsolutePath(`../../.env.${process.env.NODE_ENV || "development"}`),
});

export const {
  NODE_ENV,
  PORT,
  CORS_ORIGIN_URLS,
  COOKIE_SECRET,
  CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY,
  API_DOC_URI,

  /* ---- Postgres database ----*/
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PORT,
  /*--- Mpesa sandbox--- */
  SANDBOX_CONSUMER_KEY,
  SANDBOX_CONSUMER_SECRET,
  MPESA_SANDBOX_API_URL,
  MPESA_SANDBOX_AUTH_URL,
  MPESA_EXPRESS_SANDBOX_CALLBACK_URL,
  /* Mpesa Live  */
  MPESA_LIVE_API_URL,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  MPESA_API_URL,
  MPESA_AUTH_URL,
  MPESA_EXPRESS_CALLBACK_URL,
} = process.env;
