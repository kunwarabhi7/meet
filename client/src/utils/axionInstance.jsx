import axios from "axios";

// const BASE_URL =
//   import.meta.env.MODE === "development"
//     ? import.meta.env.VITE_DEV_API
//     : import.meta.env.VITE_PROD_API;

const BASE_URL = import.meta.env.VITE_PROD_API;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
