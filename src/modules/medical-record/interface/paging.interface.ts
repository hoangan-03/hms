interface PaginationParams {
  page?: number;
  size?: number;
}

interface DateRangeFilter {
  dateFrom?: Date;
  dateTo?: Date;
}

interface PaginatedResult<MedicalRecord> {
  data: MedicalRecord[];
  meta: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}