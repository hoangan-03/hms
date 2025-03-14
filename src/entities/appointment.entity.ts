import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { Patient } from "./patient.entity";
import { Doctor } from "./doctor.entity";
import { TimeSlot } from "@/modules/appointment/enums/time-slot.enum";
import { AppointmentStatus } from "@/modules/appointment/enums/appointment-status.enum";

@Entity({ name: "appointments" })
export class Appointment extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: "Appointment unique identifier",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "2025-03-12",
    description: "Appointment date",
  })
  @Column({ type: "date", nullable: false })
  date: Date;

  @ApiProperty({
    example: "a8_9",
    description: "Appointment time slot",
  })
  @Column({ type: "enum", enum: TimeSlot, nullable: false })
  timeSlot: TimeSlot;

  @ApiPropertyOptional({
    example: "General Checkup",
    description: "Appointment reason",
  })
  @Column({ type: "varchar", length: 255, nullable: true })
  reason: string;

  @ApiProperty({
    example: "Recurring headaches and fatigue",
    description: "Patient notes about symptoms or concerns",
  })
  @Column({ type: "varchar", length: 255, nullable: true })
  notes: string;

  @ApiProperty({
    example: "pending",
    description: "Appointment status",
    enum: AppointmentStatus,
  })
  @Column({ type: "enum", enum: AppointmentStatus, nullable: false })
  status: AppointmentStatus;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  @JoinColumn({ name: "doctor_id" })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: "patient_id" })
  patient: Patient;
}
