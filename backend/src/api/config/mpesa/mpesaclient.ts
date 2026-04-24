import axios, { AxiosError, AxiosInstance } from "axios";
import {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  MPESA_API_URL,
  MPESA_AUTH_URL,
} from "../env";
import ServiceError from "../../utils/ServiceError";
import logger from "../../logger/logger.winston";
import { redisClient } from "../redis";
import { MPESA_TOKEN_DATA } from "../../constants";

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

let token: string | null = null;
let expiryMs: number = 0;

redisClient
  .get(MPESA_TOKEN_DATA.TOKEN)
  .then((t) => (token = t || token))
  .catch((error) =>
    logger.error(`Redis error at mpesa client: ${error.message}`),
  );
redisClient
  .get(MPESA_TOKEN_DATA.EXPIRY)
  .then((ex) => (expiryMs = Number(ex) || expiryMs))
  .catch((error) =>
    logger.error(`Redis error at mpesa client: ${error.message}`),
  );

class MpesaClient {
  private audience: string;
  private consumerKey: string;
  private consumerSecret: string;
  private authUrl: string;
  private token: string | null;
  private tokenExpiryMs: number; // expires in 1 hour
  private api: AxiosInstance;

  constructor() {
    this.audience = MPESA_API_URL as string;
    this.consumerKey = CONSUMER_KEY as string;
    this.consumerSecret = CONSUMER_SECRET as string;
    this.authUrl = MPESA_AUTH_URL as string;
    this.token = token;
    this.tokenExpiryMs = expiryMs;

    this.api = axios.create({
      baseURL: this.audience,
      timeout: 120000, // 2 min
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        logger.info(
          `Mpesa request: url:${config.url} token expiry: ${this.tokenExpiryMs}`,
        );
        // configure outh header
        // config.headers.Authorization = `Bearer ${this.token}`;
        return config;
      },
      (err: any) => logger.error(`Mpesa request error: ${err.message}`),
    );

    this.api.interceptors.response.use(
      function onFullFilled(response) {
        return response;
      },
      function onRejected(error: AxiosError<any>) {
        if (error.response && error.response.status >= 400) {
          const { data, status } = error.response;
          console.dir(data);

          const message =
            data?.errorMessage ||
            data?.ResponseDescription ||
            data?.error_description ||
            "Unknown M-Pesa error";
          const mpesaError = new ServiceError(
            message,
            error.config?.url as string,
          );
          logger.error(
            `Mpesa service error: status: ${status} message: ${message}`,
          );
          return Promise.reject(mpesaError);
        }
        return Promise.reject(error);
      },
    );
  }

  private async getAccessToken() {
    // get the current time in milliseconds
    const currentTimeMs = Date.now();

    // if access token is still valid
    if (this.token && currentTimeMs < this.tokenExpiryMs) {
      return this.token;
    }

    // otherwise get new access token
    const clientCredentials = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
    ).toString("base64");

    const response = await this.api.get<TokenResponse>(
      `${this.authUrl}/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${clientCredentials}`,
        },
        params: {
          grant_type: "client_credentials",
        },
      },
    );
    this.token = response.data.access_token;
    // mpesa return expires_in(seconds) as a string convert to number for good math(convert to milliseconds)
    const expiresAt = Number(response.data.expires_in) * 1000;
    this.tokenExpiryMs = currentTimeMs + expiresAt - 60; // minus 60 so that the request is sent 1 minute before the token expires to avoid token expiring mid-level request

    // save to redis
    await redisClient.set(MPESA_TOKEN_DATA.TOKEN, this.token);
    await redisClient.set(MPESA_TOKEN_DATA.EXPIRY, this.tokenExpiryMs);

    logger.info(`Mpesa token refreshed `);
    return response.data.access_token;
  }

  public async request<T, D>(
    method: string,
    url: string,
    data?: D,
  ): Promise<T> {
    const _token = await this.getAccessToken();
    const response = await this.api.request({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${_token}`,
      },
    });
    return response.data;
  }
}

export const mpesaClient = new MpesaClient();
