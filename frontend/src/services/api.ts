import axios, { AxiosError } from "axios";
import { AUTH_DATA } from "../constants";
import type {
  AnalyticsApiResponse,
  ConfigApiSchema,
  LinksApiResponse,
  LinkType,
  PaymentApiResponse,
} from "@/validators/schemas";

import type { PaymentSTK } from "@/validators/schemas";
import type { FilterOption, PaymentLinkInput, TX } from "@paylink/shared";
// create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI || "/api",
  withCredentials: true,
  timeout: 20000, // 20 seconds
});
const api2 = axios.create({
  baseURL: import.meta.env.VITE_API_URI || "/api",
  withCredentials: true,
  timeout: 20000, // 20 seconds
});

// request and response interceptors
api.interceptors.request.use((config) => {
  // custom config for the request
  let token = localStorage.getItem(AUTH_DATA.PAYLINK_TOKEN);
  let tokenExpiry = localStorage.getItem(AUTH_DATA.PAYLINK_TOKEN_EXPIRY);

  if (token && tokenExpiry) {
    const tokenExpiryMs = Number(tokenExpiry);

    const nowMs = Date.now();

    if (tokenExpiryMs < nowMs) {
      // use another axios instance to avoid infinate loop and too many requests
      api2.get("/auth/refresh-token").then((res) => {
        const token = res.data.accessToken;
        const expiresIn = res.data.expiresIn;

        config.headers.Authorization = `Bearer ${token}`;

        setTimeout(() => {
          localStorage.setItem(
            AUTH_DATA.PAYLINK_TOKEN,
            JSON.stringify(token || null),
          );
          localStorage.setItem(
            AUTH_DATA.PAYLINK_TOKEN_EXPIRY,
            JSON.stringify(expiresIn + Date.now() - 60_000),
          );
        }, 0);
      });
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (error: AxiosError) => {
    // unauthorized request
    if (
      error.response &&
      error.response.status === 401 &&
      error.config?.url !== "/auth/sign-in"
    ) {
      // remove the local storage information and redirect user to login(user and token)
      // window.location.href = "/sign-in";
      console.log(error.response.data);
      localStorage.removeItem(AUTH_DATA.PAYLINK_TOKEN);
      localStorage.removeItem(AUTH_DATA.PAYLINK_USER);
      localStorage.removeItem(AUTH_DATA.PAYLINK_TOKEN_EXPIRY);

      window.location.href = "/sign-in";
    }
    // handle unexpected errors
    return Promise.reject(error);
  },
);

// api services

export const authAPI = {
  register: (data: any) => api.post("/auth/sign-up", data),
  login: (d: any) => api.post("/auth/sign-in", d),
  logout: () => api.delete("/auth/sign-out"),
  me: (id: string) => api.get(`/users/${id}`),
  refreshToken: () => api.get("/auth/refresh-token"),
};

export const linksAPI = {
  getAll: (options: FilterOption & { status: any }) =>
    api.get<{}, LinksApiResponse>("/links", {
      params: {
        page: options.page,
        limit: options.limit,
        status: options.status,
      },
    }),
  getByRef: (ref: string) =>
    api.get<{}, { data: LinkType }>(`/links/link`, {
      params: {
        token: ref,
      },
    }),
  create: (d: PaymentLinkInput) =>
    api.post<{}, {data: LinkType}, PaymentLinkInput>("/links", d),
  update: (id: string, d: any) => api.patch(`/links/${id}`, d),
  remove: (id: string) => api.delete(`/links/${id}`),
};

export const mpesaAPI = {
  stkPush: (d: PaymentSTK) =>
    api.post<{}, { data: TX }, PaymentSTK>("/payments/mpesa/stk-push", d),
  query: (id:  string) => api.get<{}, {data: TX }>(`/payments/:${id}/status`),
  getTransaction: (id: string) => api.get(`/payments/mpesa/transaction/${id}`),
  getAll: () => api.get<{}, PaymentApiResponse>("/payments"),
};

export const dashboardAPI = {
  get: () => api.get<{}, AnalyticsApiResponse>("/analytics"),
};
export const configAPI = {
  get: () => api.get<{}, ConfigApiSchema>("/configs"),
  save: (d: any) => api.post("/configs", d),
  update: (d: any) => api.patch("/configs", d),
};

export default api;
