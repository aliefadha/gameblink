export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

// Pagination metadata interface
export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

// Paginated API response interface for list endpoints
export interface PaginatedApiResponse<T> {
    statusCode: number;
    message: string;
    data: {
        data: T[];
        meta: PaginationMeta;
    };
}

// Generic API response for single items
export interface SingleApiResponse<T> extends ApiResponse<T> {}

// Error response interface
export interface ApiErrorResponse {
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>;
}