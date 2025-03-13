import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { Patient } from "./patient.entity";
  import { Doctor } from "./doctor.entity";
  
  @Entity({ name: "appointments" })
  export class Appointment extends BaseEntity {
    @ApiProperty({
      example: 1,
      description: "Appointment unique identifier",
    })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({
      example: "2025-03-12 10:00:00",
      description: "Appointment date and time",
    })
    @Column({ type: "timestamp", nullable: false })
    dateTime: Date;
  
    @ApiProperty({
      example: "General Checkup",
      description: "Appointment reason",
    })
    @Column({ type: "varchar", length: 255, nullable:true })
    reason: string;
  
    @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
    @JoinColumn({ name: "doctor_id" })
    doctor: Doctor;
  
    @ManyToOne(() => Patient, (patient) => patient.appointments)
    @JoinColumn({ name: "patient_id" })
    patient: Patient;
  }
  