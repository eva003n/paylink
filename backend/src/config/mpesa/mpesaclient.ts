import axios, { AxiosError, AxiosInstance } from "axios";
import {
  NODE_ENV,
  PROD_MPESA_LIVE_API_URL,
  MPESA_SANDBOX_API_URL,
  PROD_CONSUMER_KEY,
  SANDBOX_CONSUMER_KEY,
  PROD_CONSUMER_SECRET,
  SANDBOX_CONSUMER_SECRET,
  PROD_MPESA_AUTH_URL,
  MPESA_SANDBOX_AUTH_URL,
} from "../env";
import ServiceError from "../../utils/ServiceError";
import logger from "../../logger/logger.winston";

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

class MpesaClient {
  private audience: string;
  private consumerKey: string;
  private consumerSecret: string;
  private authUrl: string;
  private token: string | null;
  private tokenExpiry: number; // expires in 1 hour
  private api: AxiosInstance;

  constructor() {
    this.audience = (
      NODE_ENV === "production" ? PROD_MPESA_LIVE_API_URL : MPESA_SANDBOX_API_URL
    ) as string;
    this.consumerKey = (
      NODE_ENV === "production" ? PROD_CONSUMER_KEY : SANDBOX_CONSUMER_KEY
    ) as string;
    this.consumerSecret = (
      NODE_ENV === "production" ? PROD_CONSUMER_SECRET : SANDBOX_CONSUMER_SECRET
    ) as string;
    this.authUrl = (
      NODE_ENV === "production" ? PROD_MPESA_AUTH_URL : MPESA_SANDBOX_AUTH_URL
    ) as string;
    this.token = null;
    this.tokenExpiry = 0;

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
          `Mpesa request: url:${config.url} token expiry: ${this.tokenExpiry}`,
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
      function onRejected(
        error: AxiosError<{ errorMessage: string }>,
      ) {
        if (error.response?.status === 400) {
          const mpesaError = new ServiceError(
            error.response.data?.errorMessage,
            error.config?.url as string,
          );
          logger.error(`Mpesa service error: ${mpesaError.message}`);
          return Promise.reject(mpesaError);
        }
          logger.error(
            `Mpesa service error: ${error.response?.data?.errorMessage}`,
          );

        return Promise.reject(error);
      },
    );
  }

  private async getAccessToken() {
    // get the current time in milliseconds and convert to seconds
    const currentTimeSec = Date.now() / 1000;

    // if access token is still valid
    if (this.token && currentTimeSec < this.tokenExpiry) {
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
    this.tokenExpiry = currentTimeSec + response.data.expires_in - 60; // minus 60 so that the request is sent 1 minute before the token expires to avoid token expiring mid-level request

    return this.token;
  }

  public async request<T, D>(
    method: string,
    url: string,
    data?: D,
  ): Promise<T> {
    const token = await this.getAccessToken();
    const response = await this.api.request({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export const mpesaClient = new MpesaClient();
