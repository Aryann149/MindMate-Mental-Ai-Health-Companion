import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Attach bearer token as a fallback for environments where cookies
// (SameSite/third-party) are restricted, e.g. some mobile webviews.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mindmate_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("mindmate_token");
      localStorage.removeItem("mindmate_user");
    }
    return Promise.reject(error);
  }
);

export default api;
