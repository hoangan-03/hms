import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "@/entities/appointment.entity";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PatientService } from "../patient/patient.service";
import { DoctorService } from "../doctor/doctor.service";
import { formatAsDDMMYYYY, formatStartDate } from "@/utils/parse-date-string";
import {
  PaginationParams,
  DateRangeFilter,
} from "../medical-record/interface/paging-response-medical-record.interface";
import { PaginatedAppointmentResponse } from "./interface/paging-response-appointment.interface";
import { CreateAppointmentDto } from "./dtos/create-appointment.dto";
import { Doctor } from "@/entities/doctor.entity";
import { TimeSlot } from "./enums/time-slot.enum";
import { AppointmentStatus } from "./enums/appointment-status.enum";
import { timeSlotToString } from "@/utils/time-slot-to-string";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>
  ) {}

  // Get all apointments of a specific patient
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

    if (dateFrom) {
      queryBuilder.andWhere("appointment.date > :dateFrom", {
        dateFrom: formatStartDate(dateFrom),
      });
    }
    if (dateTo) {
      const nextDay = new Date(dateTo);
      nextDay.setDate(nextDay.getDate() + 2);

      queryBuilder.andWhere("appointment.date < :dateTo", {
        dateTo: formatStartDate(nextDay),
      });
    }

    queryBuilder.orderBy("appointment.date", orderDirection);

    const totalItems = await queryBuilder.getCount();

    const skip = (page - 1) * perPage;
    queryBuilder.skip(skip).take(perPage);

    const appointments = await queryBuilder.getMany();

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

  // Get all appointments of a specific doctor
  async getAppointmentOfDoctor(
    doctorId: number,
    { page = 1, perPage = 10 }: PaginationParams = {},
    { dateFrom, dateTo }: DateRangeFilter = {},
    orderDirection: "ASC" | "DESC" = "DESC"
  ): Promise<PaginatedAppointmentResponse> {
    await this.doctorService.getOne({ where: { id: doctorId } });

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.doctor", "doctor")
      .leftJoinAndSelect("appointment.patient", "patient")
      .leftJoinAndSelect("doctor.department", "department")
      .where("doctor.id = :doctorId", { doctorId });

    if (dateFrom) {
      queryBuilder.andWhere("appointment.date > :dateFrom", {
        dateFrom: formatStartDate(dateFrom),
      });
    }
    if (dateTo) {
      const nextDay = new Date(dateTo);
      nextDay.setDate(nextDay.getDate() + 2);

      // First order by date, then by timeSlot
      queryBuilder
        .orderBy("appointment.date", orderDirection)
        .addOrderBy("appointment.timeSlot", orderDirection);
    }

    queryBuilder.orderBy("appointment.date", orderDirection);

    const totalItems = await queryBuilder.getCount();

    const skip = (page - 1) * perPage;
    queryBuilder.skip(skip).take(perPage);

    const appointments = await queryBuilder.getMany();

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

  // Get a specific appointment by ID
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

  // Get all available doctors for a specific date and time slot
  async getAvailableDoctorsForTimeSlot(
    date: string,
    timeSlot: TimeSlot,
    departmentId?: number
  ): Promise<Doctor[]> {
    const appointmentDate = new Date(date);

    // Find all doctors that are already booked for this time slot
    const bookedDoctorIds = await this.appointmentRepository
      .createQueryBuilder("appointment")
      .select("appointment.doctor.id")
      .where("appointment.date = :date", { date: appointmentDate })
      .andWhere("appointment.timeSlot = :timeSlot", { timeSlot })
      .getMany()
      .then((appointments) => appointments.map((appt) => appt.doctor.id));
    const doctorQueryBuilder = this.doctorRepository
      .createQueryBuilder("doctor")
      .leftJoinAndSelect("doctor.department", "department");

    // Filter by department if provided
    if (departmentId) {
      doctorQueryBuilder.andWhere("department.id = :departmentId", {
        departmentId,
      });
    }

    // Exclude already booked doctors
    if (bookedDoctorIds.length > 0) {
      doctorQueryBuilder.andWhere("doctor.id NOT IN (:...bookedDoctorIds)", {
        bookedDoctorIds,
      });
    }

    // Get the available doctors
    return doctorQueryBuilder.getMany();
  }

  // Get all available time slots for a specific doctor on a specific date
  async getAvailableTimeSlotsForDoctor(
    doctorId: number,
    date: string
  ): Promise<TimeSlot[]> {
    const appointmentDate = new Date(date);

    // Find all booked time slots for this doctor on the specified date
    const bookedTimeSlots = await this.appointmentRepository
      .createQueryBuilder("appointment")
      .select("appointment.timeSlot")
      .where("appointment.date = :date", { date: appointmentDate })
      .andWhere("appointment.doctor.id = :doctorId", { doctorId })
      .getMany()
      .then((appointments) => appointments.map((appt) => appt.timeSlot));

    // Create a list of all possible time slots
    const allTimeSlots = Object.values(TimeSlot);

    // Return only the time slots that are not booked
    return allTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot));
  }

  // Check if a specific time slot is available for a doctor on a specific date
  async isTimeSlotAvailable(
    doctorId: number,
    date: string,
    timeSlot: TimeSlot
  ): Promise<boolean> {
    try {
      const dateObj = new Date(date);
      // Check for existing appointment
      const existingAppointment = await this.appointmentRepository.findOne({
        where: {
          doctor: { id: doctorId },
          date: dateObj,
          timeSlot: timeSlot,
        },
      });
      return !existingAppointment;
    } catch (error) {
      console.error("Error in isTimeSlotAvailable:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("Failed to check time slot availability");
    }
  }

  // Create a new appointment
  async createAppointment(
    patientId: number,
    appointmentDto: CreateAppointmentDto
  ): Promise<Appointment> {
    await this.patientService.getOne({ where: { id: patientId } });

    const doctor = await this.doctorService
      .getOne({
        where: { id: appointmentDto.doctorId },
        relations: ["department"],
      })
      .catch(() => {
        throw new BadRequestException(
          `Doctor with ID ${appointmentDto.doctorId} not found`
        );
      });

    // Check if the time slot is available
    const isAvailable = await this.isTimeSlotAvailable(
      appointmentDto.doctorId,
      appointmentDto.date.toISOString(),
      appointmentDto.timeSlot
    );

    if (!isAvailable) {
      throw new BadRequestException(
        `This time slot ${timeSlotToString(
          appointmentDto.timeSlot
        )} is already booked with Dr. ${doctor.name} on ${formatAsDDMMYYYY(
          appointmentDto.date
        )}`
      );
    }

    // Create appointment with references to patient and doctor
    const appointment = this.appointmentRepository.create({
      date: new Date(appointmentDto.date),
      timeSlot: appointmentDto.timeSlot,
      reason: appointmentDto.reason,
      status: AppointmentStatus.PENDING,
      notes: appointmentDto.notes,
      patient: { id: patientId },
      doctor: { id: appointmentDto.doctorId },
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);
    return this.getAppointment(savedAppointment.id);
  }

  // Cancel an appointment
  async cancelAppointment(id: number): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    appointment.status = AppointmentStatus.CANCELLED;
    const updatedAppointment = await this.appointmentRepository.save(
      appointment
    );

    return this.getAppointment(updatedAppointment.id);
  }

  // Confirm an appointment
  async confirmAppointment(id: number): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Check if appointment is already cancelled
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException(
        `Cannot confirm appointment with ID ${id} because it has been cancelled`
      );
    }

    appointment.status = AppointmentStatus.COMFIRMED;
    const updatedAppointment = await this.appointmentRepository.save(
      appointment
    );

    return this.getAppointment(updatedAppointment.id);
  }

  // Reschedule an appointment
  async rescheduleAppointment(
    id: number,
    appointmentDto: CreateAppointmentDto
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);

    const doctor = await this.doctorService.getOne({
      where: { id: appointmentDto.doctorId },
    });

    const isAvailable = await this.isTimeSlotAvailable(
      appointmentDto.doctorId,
      appointmentDto.date.toISOString(),
      appointmentDto.timeSlot
    );

    if (!isAvailable) {
      throw new BadRequestException(
        `This time slot is already booked with Dr. ${doctor.name} on ${appointmentDto.date}`
      );
    }

    appointment.date = appointmentDto.date;
    appointment.timeSlot = appointmentDto.timeSlot;
    appointment.reason = appointmentDto.reason;
    appointment.notes = appointmentDto.notes;
    appointment.doctor = doctor;
    appointment.status = AppointmentStatus.PENDING;

    const updatedAppointment = await this.appointmentRepository.save(
      appointment
    );

    return this.getAppointment(updatedAppointment.id);
  }
}
