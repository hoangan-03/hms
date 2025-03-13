import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "@/entities/appointment.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PatientService } from "../patient/patient.service";
import { formatStartDate } from "@/utils/parse-date-string";
import { PaginationParams, DateRangeFilter } from "../medical-record/interface/paging-response-medical-record.interface";
import { PaginatedAppointmentResponse } from "./interface/paging-response-appointment.interface";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly patientService: PatientService
  ) {}

  async getAppointments(
    patientId: number,
    { page = 1, perPage = 10 }: PaginationParams = {},
    { dateFrom, dateTo }: DateRangeFilter = {},
    orderDirection: "ASC" | "DESC" = "DESC"
  ): Promise<PaginatedAppointmentResponse> {
    await this.patientService.getOne({ where: { id: patientId } });
    
    const queryBuilder = this.appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.doctor", "doctor")
      .leftJoinAndSelect("appointment.patient", "patient")
      .leftJoinAndSelect("doctor.department", "department")
      .where("patient.id = :patientId", { patientId });

    // Add date range filters if provided
    if (dateFrom) {
      queryBuilder.andWhere("appointment.dateTime >= :dateFrom", {
        dateFrom: formatStartDate(dateFrom),
      });
    }
    if (dateTo) {
      const nextDay = new Date(dateTo);
      nextDay.setDate(nextDay.getDate() + 1);
      queryBuilder.andWhere("appointment.dateTime < :dateTo", {
        dateTo: formatStartDate(nextDay),
      });
    }

    // Add ordering
    queryBuilder.orderBy("appointment.dateTime", orderDirection);

    // Count total items for pagination
    const totalItems = await queryBuilder.getCount();

    // Add pagination
    const skip = (page - 1) * perPage;
    queryBuilder.skip(skip).take(perPage);

    // Execute query
    const appointments = await queryBuilder.getMany();

    // Return paginated result
    return {
      data: appointments,
      pagination: {
        totalItems,
        page,
        perPage,
        totalPages: Math.ceil(totalItems / perPage),
      },
    };
  }

  async getAppointment(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ["doctor", "patient", "doctor.department"],
    });
    
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    
    return appointment;
  }

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(data);
    return this.appointmentRepository.save(appointment);
  }
}