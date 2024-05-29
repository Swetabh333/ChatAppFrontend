import axios from "axios";

const backendURL = import.meta.env.VITE_REACT_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

export default axiosInstance;
