import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appointment } from "@/entities/appointment.entity";
import { AppointmentService } from "./appointment.service";
import { AppointmentController } from "./appointment.controller";
import { PatientService } from "../patient/patient.service";
import { PatientModule } from "../patient/patient.module";
import { Patient } from "@/entities/patient.entity";
import { Billing } from "@/entities/billing.entity";
import { Department } from "@/entities/department.entity";
import { Doctor } from "@/entities/doctor.entity";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { Insurance } from "@/entities/insurance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Doctor, Department, MedicalRecord, Appointment,Billing, Insurance ])],
  controllers: [AppointmentController],
  providers: [AppointmentService, PatientService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
