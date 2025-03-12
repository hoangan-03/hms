import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "@/entities/patient.entity";
import { Doctor } from "@/entities/doctor.entity";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { Appointment } from "@/entities/appointment.entity";
import { Billing } from "@/entities/billing.entity";
import { Insurance } from "@/entities/insurance.entity";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.service";
import { Department } from "@/entities/department.entity";
@Module({
  imports: [TypeOrmModule.forFeature([Patient, Doctor, Department, MedicalRecord, Appointment,Billing, Insurance])],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],

})
export class PatientModule {}
