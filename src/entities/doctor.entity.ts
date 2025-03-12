import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { Appointment } from "./appointment.entity";
  import { MedicalRecord } from "./medical-record.entity";
import { Department } from "./department.entity";
  
  @Entity({ name: "doctors" })
  export class Doctor extends BaseEntity {
    @ApiProperty({
      example: 1,
      description: "Doctor unique identifier",
    })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({
      example: "Dr. Jane Smith",
      description: "Doctor full name",
    })
    @Column({ type: "varchar", length: 255 })
    name: string;
  
    @ApiProperty({
      example: "+1234567890",
      description: "Doctor phone number",
    })
    @Column({ type: "varchar", length: 20, nullable: true })
    phoneNumber: string;
  
    @OneToMany(() => Appointment, (appointment) => appointment.doctor, { cascade: true })
    appointments: Appointment[];
  
    @OneToMany(() => MedicalRecord, (record) => record.doctor)
    medicalRecords: MedicalRecord[];

    @ManyToOne(() => Department, (department) => department.doctors)
    department: Department;
  
  }
  