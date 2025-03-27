import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { Appointment } from "../../../entities/appointment.entity";
import { MedicalRecord } from "../../../entities/medical-record.entity";
import { Department } from "../../../entities/department.entity";
import { Role } from "@/modules/auth/enums/role.enum";

@Entity({ name: "doctors" })
export class DoctorResponseDto extends BaseEntity {
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
    example: "drjane",
    description: "Doctor username",
  })
  @Column({ type: "varchar", length: 50, unique: true })
  username: string;

  @ApiProperty({
    example: "+1234567890",
    description: "Doctor phone number",
  })
  @Column({ type: "varchar", length: 20, nullable: true })
  phoneNumber: string;

  @ApiProperty({
    enum: Role,
    example: Role.DOCTOR,
    description: "User role",
  })
  @Column({
    type: "enum",
    enum: Role,
    default: Role.DOCTOR,
  })
  role: Role;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor, {
    cascade: true,
  })
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (record) => record.doctor)
  medicalRecords: MedicalRecord[];

  @ManyToOne(() => Department, (department) => department.doctors)
  department: Department;
}
