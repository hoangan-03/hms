import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "@/entities/appointment.entity";
import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PatientService } from "../patient/patient.service";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly patientService: PatientService
  ) {}

  async getAppointments(patientId: number): Promise<Appointment[]> {
    await this.patientService.getOne({ where: { id: patientId } });        
    return this.appointmentRepository.find({
      where: { patient: { id: patientId } },
      relations: ["doctor", "doctor.department"],
      order: { dateTime: "DESC" },
    });
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