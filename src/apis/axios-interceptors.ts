import axios from "axios";
import { message } from "antd";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (config.headers) config.headers.authorization = `Bearer ${token}`
  }
  return config;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (
      error?.response?.status === 401
    ) {
      const token = localStorage.getItem('token')
      if (token) {
        localStorage.removeItem('token')
        message.error('Unauthorized Login Again',2)
      }
      window.location.replace(`${window.location.origin}/`);
    } else {
      return error.response;
    }
  }
);

export default API;
