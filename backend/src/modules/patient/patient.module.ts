import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "@/entities/patient.entity";
import { Doctor } from "@/entities/doctor.entity";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { Appointment } from "@/entities/appointment.entity";
import { Insurance } from "@/entities/insurance.entity";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.service";
import { Department } from "@/entities/department.entity";
import { IsUserNameAlreadyExist } from "./validators/is-username-already-exist.validator";
@Module({
  imports: [TypeOrmModule.forFeature([Patient, Doctor, Department, MedicalRecord, Appointment, Insurance])],
  controllers: [PatientController],
  providers: [PatientService, IsUserNameAlreadyExist],
  exports: [PatientService],

})
export class PatientModule {}
