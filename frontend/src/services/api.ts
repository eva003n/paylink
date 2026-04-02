import axios, { AxiosError, type responseEncoding } from "axios";
import { AUTH_DATA } from "../constants";

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

  if(token && tokenExpiry) {
token = JSON.parse(token);
const tokenExpiryMs = Number(JSON.parse(tokenExpiry));

const nowMs = Date.now();

if (tokenExpiryMs < nowMs) {
  config.headers.Authorization = `Bearer ${token}`;
} else {
  api2.get("/auth/refresh-token").then((res) => {
    const token = res.data.accessToken;
    const expiresIn = res.data.expiresIn;

    config.headers.Authorization = `Bearer ${token}`;

    localStorage.setItem(AUTH_DATA.PAYLINK_TOKEN, token || null);
    localStorage.setItem(
      AUTH_DATA.PAYLINK_TOKEN_EXPIRY,
      JSON.stringify(expiresIn + Date.now()),
    );
  });
}
}
  

  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (error: AxiosError) => {
    // unauthorized request
    if (error.response && error.response.status === 401) {
      // remove the local storage information and redirect user to login(user and token)
      window.location.href = "/login";
    }
    // handle unexpected errors
    return Promise.reject(error.response?.data);
  },
);

// api services

export const authAPI = {
  register: (data: any) => api.post("/auth/sign-up", data),
  login: (d: any) => api.post("/auth/sign-in", d),
  logout: () => api.delete("/auth/sign-out"),
  me: (id: string) => api.get(`/users/${id}`),
};

export const linksAPI = {
  getAll: () => api.get("/links"),
  getByRef: (ref: string) => api.get(`/links/p/${ref}`),
  create: (d: any) => api.post("/links", d),
  update: (id: string, d: any) => api.patch(`/links/${id}`, d),
  remove: (id: string) => api.delete(`/links/${id}`),
};

export const mpesaAPI = {
  stkPush: (d: any) => api.post("/payments/mpesa/stk-push", d),
  query: (d: any) => api.post("/payments/mpesa/query", d),
  getTransaction: (id: string) => api.get(`/payments/mpesa/transaction/${id}`),
  getAll: () => api.get("/payments/mpesa/transactions"),
};

export const dashboardAPI = { get: () => api.get("/dashboard") };
export const configAPI = {
  get: () => api.get("/config"),
  save: (d: any) => api.put("/config", d),
};

export default api;
