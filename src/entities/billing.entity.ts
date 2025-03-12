import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { Patient } from "./patient.entity";
  
  @Entity({ name: "billing" })
  export class Billing extends BaseEntity {
    @ApiProperty({ example: 1, description: "Billing ID" })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({ example: 100.5, description: "Total amount" })
    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount: number;
  
    @ApiProperty({ example: "2025-03-12", description: "Billing date" })
    @Column({ type: "date" })
    billingDate: Date;
  
    @ManyToOne(() => Patient, (patient) => patient.billings)
    patient: Patient;
  }
  