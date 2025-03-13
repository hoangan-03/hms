import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { Appointment } from "./appointment.entity";
import { MedicalRecord } from "./medical-record.entity";
import { Billing } from "./billing.entity";
import { Insurance } from "./insurance.entity";
import { Gender } from "@/modules/patient/enums/gender.enum";
import { Exclude } from "class-transformer";

@Entity({ name: "patients" })
export class Patient extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: "Patient unique identifier",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "John Doe",
    description: "Patient full name",
  })
  @Column({ type: "varchar", length: 255, nullable: true })
  name: string;

  @ApiProperty({
    example: "username123",
    description: "Patient username",
  })
  @Column({ type: "varchar", length: 50, unique: true })
  username: string;

  @ApiProperty({
    example: "password123",
    description: "Patient password",
  })
  @Column({ type: "varchar", length: 255 })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({
    example: 30,
    description: "Patient age",
  })
  @Column({ type: "int", nullable: true })
  age: number;

  @ApiProperty({
    example: "Male",
    description: "Patient gender",
  })
  @Column({
    type: "enum", 
    enum: Gender,
    nullable: true
  })
  gender: Gender;

  @ApiProperty({
    example: "+1234567890",
    description: "Patient phone number",
  })
  @Column({ type: "varchar", length: 20, nullable: true })
  phoneNumber: string;

  @ApiProperty({
    example: "45 Elm Street",
    description: "Patient address",
  })
  @Column({ type: "text", nullable: true })
  address: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (record) => record.patient)
  medicalRecords: MedicalRecord[];

  @OneToMany(() => Billing, (billing) => billing.patient)
  billings: Billing[];

  @OneToMany(() => Insurance, (insurance) => insurance.patient)
  insurances: Insurance[];
}
