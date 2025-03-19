import { PatientModule } from './../patient/patient.module';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { MedicalRecordService } from "./medical-record.service";
import { MedicalRecordController } from "./medical-record.controller";
import { Prescription } from "@/entities/prescription.entity";
import { PatientService } from "../patient/patient.service";
@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, Prescription]), PatientModule],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}
