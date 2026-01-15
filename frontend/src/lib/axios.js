import axios from "axios";

console.log("🔧 VITE_API_URL:", import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use((config) => {
  console.log("🚀 Request:", config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

export default axiosInstance;