import { UseFormSetError } from "react-hook-form";

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
    count?: number;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
    details?: Record<string, string[]>;
    message?: string;
}

export interface HandleApiErrorOptions<T> {
    setError: UseFormSetError<T>;
    errorFieldMap?: Record<string, keyof T>;
    showToast?: boolean;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;