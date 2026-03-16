import type { AxiosError } from "axios";

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export function getApiErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as AxiosError<ApiErrorResponse>;
    const data = err.response?.data;
    if (data?.message) return data.message;
    if (data?.errors) {
      const first = Object.values(data.errors)[0];
      return Array.isArray(first) ? first[0] : String(first);
    }
  }
  return "Đã xảy ra lỗi. Vui lòng thử lại.";
}
