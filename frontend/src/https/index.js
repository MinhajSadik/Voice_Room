import axios from "axios";

const devEnv = process.env.NODE_ENV === "development";

const { REACT_APP_DEV_API_URL, REACT_APP_PROD_API_URL } = process.env;

const api = axios.create({
  // baseURL: `${devEnv ? REACT_APP_DEV_API_URL : REACT_APP_PROD_API_URL}`,
  baseURL: REACT_APP_DEV_API_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

export const sendOtp = (payload) => api.post("/api/user/sendOtp", payload);
export const verifyOtp = (payload) => api.post("/api/user/verifyOtp", payload);
export const activate = (payload) => api.post("/api/user/activate", payload);
export const logout = () => api.post("/api/user/logout");
export const createRoom = (payload) => api.post("/api/room/rooms", payload);
export const getAllRooms = () => api.get("/api/room/rooms");
export const getRoom = (roomId) => api.get(`/api/room/rooms/${roomId}`);

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
