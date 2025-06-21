import axios from "axios";

const BASE_URL = "https://meet-fi7a.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
