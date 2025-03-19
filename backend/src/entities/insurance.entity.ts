import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { Patient } from "./patient.entity";
  
  @Entity({ name: "insurances" })
  export class Insurance extends BaseEntity {
    @ApiProperty({ example: 1, description: "Insurance ID" })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({ example: "ABC Health Insurance", description: "Insurance provider name" })
    @Column({ type: "varchar", length: 255 })
    provider: string;
  
    @ApiProperty({ example: "XYZ123456", description: "Policy number" })
    @Column({ type: "varchar", length: 50, unique: true })
    policyNumber: string;
  
    @ApiProperty({ example: "80%", description: "Coverage percentage" })
    @Column({ type: "decimal", precision: 5, scale: 2 })
    coverage: number;
  
    @ApiProperty({ example: "2026-12-31", description: "Expiration date" })
    @Column({ type: "date" })
    expiryDate: Date;
  
    @ManyToOne(() => Patient, (patient) => patient.insurances)
    patient: Patient;
  }
  