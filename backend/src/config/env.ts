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
  FRONTEND_BASE_URI,
  COOKIE_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY,
  API_DOC_URI,

  /* ---- Postgres database ----*/
  POSTGRES_URL,
  /* ---- Redis database ----- */
  REDIS_URL,
  /*--- Mpesa sandbox--- */
  SANDBOX_CONSUMER_KEY,
  SANDBOX_CONSUMER_SECRET,
  MPESA_SANDBOX_API_URL,
  MPESA_SANDBOX_AUTH_URL,
  MPESA_EXPRESS_SANDBOX_CALLBACK_URL,
  MPESA_EXPRESS_SANDBOX_PASSKEY,
  MPESA_SANDBOX_SHORTCODE,
  MPESA_SANDBOX_PARTYA,
  /* Mpesa Live  */
  MPESA_LIVE_API_URL,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  MPESA_API_URL,
  MPESA_AUTH_URL,
  MPESA_EXPRESS_CALLBACK_URL,
  MPESA_EXPRESS_PASSKEY,
} = process.env;
