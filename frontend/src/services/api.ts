import axios, { AxiosError } from "axios";

// create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI || "/api",
  timeout: 20000, // 20 seconds
});

// request and response interceptors
api.interceptors.request.use((config) => {
  // custom config for the request
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    // unauthorized request
    if (error.response && error.response.status === 401) {
      // remove the local storage information and redirect user to login(user and token)
      window.location.href = "/login";
    }
    // handle unexpected errors
    return Promise.reject(error);
  },
);

// api services

export const authAPI = {
  register: (data: any) => api.post("/auth/sign-up", data),
  login: (d: any) => api.post("/auth/login", d),
  me: () => api.get("/auth/me"),
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

