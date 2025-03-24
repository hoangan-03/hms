export interface ResponseAPI<TData> {
    status: number;
    message: string;
    data: TData;
    error?: object; // can be any key-value pair
}

export interface PaginationRequest {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginationResponse<TData> {
    pagination: {
        currentPage: number;
        perPage: number;
        totalItems: number;
    };
    data: TData;
}
