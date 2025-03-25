export interface ResponseAPI<TData> {
    // status: number;
    message?: string;
    data: TData;
    // error?: object; // can be any key-value pair
}

export interface PaginationRequest {
    page?: number;
    perPage?: number;
    dateFrom?: string; // 'DD-MM-YYYY'
    dateTo?: string; // 'DD-MM-YYYY'
    orderDirection?: 'ASC' | 'DESC';
}

export interface PaginationResponse<TData> {
    pagination: {
        page: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
    };
    data: TData;
}
