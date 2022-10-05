import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_DEV_API_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

export const sendOtp = (payload) => api.post("/api/user/sendOtp", payload);
export const verifyOtp = (payload) => api.post("/api/user/verifyOtp", payload);
export const activate = (payload) => api.post("/api/user/activate", payload);

//Interceptors
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        await axios.get(
          `${process.env.REACT_APP_DEV_API_URL}/api/user/refresh`,
          {
            withCredentials: true,
          }
        );

        return api.request(originalRequest);
      } catch (error) {
        console.error("error", error);
      }
    }
    throw error;
  }
);

export default api;
