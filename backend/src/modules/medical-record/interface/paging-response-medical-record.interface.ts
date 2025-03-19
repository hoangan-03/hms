import { MedicalRecord } from "@/entities/medical-record.entity";

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface DateRangeFilter {
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedMedicalRecordResponse{
  data: MedicalRecord[];
  pagination: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

