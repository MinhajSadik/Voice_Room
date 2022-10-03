import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_DEV_API_URL,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

export const sendOtp = (payload) => api.post("/api/user/sendOtp", payload);
export const verifyOtp = (payload) => api.post("/api/user/verifyOtp", payload);

export default api;
