import axios from "axios";

console.log("🔧 VITE_API_URL:", import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Token will be set by AxiosProvider component
let getTokenFn = null;

export const setTokenGetter = (fn) => {
  getTokenFn = fn;
};

// Add request interceptor to include Clerk token
axiosInstance.interceptors.request.use(async (config) => {
  console.log("🚀 Request:", config.method?.toUpperCase(), config.baseURL + config.url);
  
  // Get the Clerk session token and add it to headers
  if (getTokenFn) {
    try {
      const token = await getTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
  }
  
  return config;
});

export default axiosInstance;