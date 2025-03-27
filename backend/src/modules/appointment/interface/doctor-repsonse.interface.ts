import { Appointment } from "@/entities/appointment.entity";

export interface DoctorResponse {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  username: string;
  password: string;
  phoneNumber: string;
  role: string;
}
