import axios from "axios";
import envConfig from "./env.config";

export const axiosInstance = axios.create({
  baseURL: envConfig.ARTIST_ML_SERVICE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


