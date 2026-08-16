import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorResponse } from '@/types/api';

// Tạo Axios Instance giao tiếp với Backend Core NestJS
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Tự động đính kèm Token Bearer và xử lý FormData (tránh lỗi JSON.stringify {"file":{}})
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem('bookong_token');
      const cookieMatch = document.cookie.match(/bookong_token=([^;]+)/);
      const token = localToken || (cookieMatch ? cookieMatch[1] : null);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Nếu payload là FormData, xóa Content-Type mặc định (application/json) để trình duyệt/axios tự động thiết lập multipart/form-data kèm boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
      if (config.headers.post) {
        delete config.headers.post['Content-Type'];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Chuẩn hóa lỗi trả về theo API-CONTRACT.md { success: false, errorCode, message }
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data) {
      // Đã bắt được cấu trúc lỗi chuẩn từ Backend
      return Promise.reject(error.response.data);
    }
    // Lỗi mạng hoặc server không phản hồi
    return Promise.reject({
      success: false,
      errorCode: 'ERR_NETWORK',
      message: error.message || 'Kết nối máy chủ thất bại. Vui lòng thử lại sau.',
    } as ApiErrorResponse);
  }
);

export default apiClient;
