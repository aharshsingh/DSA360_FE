import axios, { AxiosError, AxiosInstance } from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "./utils";

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshResponse.data.accessToken;
          setAccessToken(newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          clearAccessToken();
          window.location.href = "/app/auth";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

export const apiClient = createApiClient();
