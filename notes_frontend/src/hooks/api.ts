import { useState, useEffect } from "react";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// You might want to store this in an environment variable
const API_BASE_URL = "http://localhost:8000";

export function useApi(): AxiosInstance {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [api, _setApi] = useState<AxiosInstance>(
    axios.create({
      baseURL: API_BASE_URL,
    })
  );

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = api.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            try {
              const response = await axios.post("/users/refresh", {
                refresh: refreshToken,
              });
              const { access } = response.data;
              localStorage.setItem("accessToken", access);
              api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
              return api(originalRequest);
            } catch (refreshError) {
              // Handle refresh token error (e.g., logout user)
              return Promise.reject(refreshError);
            }
          }
          return Promise.reject(error);
        }
      );

    // Cleanup function to eject interceptors when component unmounts
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [api]);

  return api;
}
