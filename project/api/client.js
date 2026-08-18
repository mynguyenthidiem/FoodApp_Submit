import axios from "axios";
import { getToken, removeToken } from "../utils/tokenStorage";

export const API_ORIGIN = "http://10.0.2.2:5078";
const BASE_URL = `${API_ORIGIN}/api`;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      console.log("Token expired");
    }

    return Promise.reject(error);
  }
);

export default api;