import { Appointment } from "@/entities/appointment.entity";

export interface PaginatedAppointmentResponse {
  data: Appointment[];
  pagination: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}
