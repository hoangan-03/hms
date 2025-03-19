import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { MedicalRecord } from "./medical-record.entity";
  
  @Entity({ name: "prescriptions" })
  export class Prescription extends BaseEntity {
    @ApiProperty({ example: 1, description: "Prescription ID" })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({ example: "Ibuprofen", description: "Medication name" })
    @Column({ type: "varchar", length: 255 })
    medication: string;
  
    @ApiProperty({ example: "1 tablet daily for 3 days", description: "Dosage" })
    @Column({ type: "text" })
    dosage: string;
  
    @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.prescriptions)
    medicalRecord: MedicalRecord;
  }
  