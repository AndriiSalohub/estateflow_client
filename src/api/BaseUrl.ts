import type { UserInfo } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

export const $api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

$api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.clear();
          return Promise.reject(err);
        }

        const { data } = await $api.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
          {
            refreshToken,
          },
        );
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        return $api(original);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login-form";
        return Promise.reject(refreshError);
      }
    }
    useAuthStore.setState({ isInitialized: true });
    return Promise.reject(err);
  },
);

export const login = (email: string, password: string) =>
  $api.post("/api/auth/login", { email, password });
export const fetchUser = () => $api.get("/api/user");
export const fetchUserById = (userId: string) =>
  $api.get<UserInfo>(`/api/user/${userId}`);
