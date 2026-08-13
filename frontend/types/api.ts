// Cấu trúc API Response chuẩn hóa theo API-CONTRACT.md

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: unknown;
  };
  errorCode?: string;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  errorCode: string;
  message: string;
}
