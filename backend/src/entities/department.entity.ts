import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { Doctor } from "./doctor.entity";
  
  @Entity({ name: "departments" })
  export class Department extends BaseEntity {
    @ApiProperty({ example: 1, description: "Department ID" })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({ example: "Cardiology", description: "Department name" })
    @Column({ type: "varchar", length: 255 })
    name: string;
  
    @OneToMany(() => Doctor, (doctor) => doctor.department)
    doctors: Doctor[];
  }
  