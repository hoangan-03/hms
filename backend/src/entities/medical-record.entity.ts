import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { Patient } from "./patient.entity";
  import { Doctor } from "./doctor.entity";
import { Prescription } from "./prescription.entity";
  
  @Entity({ name: "medical_records" })
  export class MedicalRecord extends BaseEntity {
    @ApiProperty({
      example: 1,
      description: "Medical Record unique identifier",
    })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({
      example: "Flu diagnosis",
      description: "Medical diagnosis",
    })
    @Column({ type: "text" })
    diagnosis: string;
  
    @ApiProperty({
      example: "2025-03-12",
      description: "Date of medical record",
    })
    @Column({ type: "date" })
    recordDate: Date;

    @OneToMany(() => Prescription, (prescription) => prescription.medicalRecord)
    prescriptions: Prescription[];
    
    @ManyToOne(() => Patient, (patient) => patient.medicalRecords)
    patient: Patient;
  
    @ManyToOne(() => Doctor, (doctor) => doctor.medicalRecords)
    doctor: Doctor;
  }
  