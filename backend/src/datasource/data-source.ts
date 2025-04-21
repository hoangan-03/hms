import { Appointment } from '@/entities/appointment.entity';
import { Department } from '@/entities/department.entity';
import { Doctor } from '@/entities/doctor.entity';
import { Insurance } from '@/entities/insurance.entity';
import { MedicalRecord } from '@/entities/medical-record.entity';
import { Patient } from '@/entities/patient.entity';
import { Prescription } from '@/entities/prescription.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'hms',
  entities: [Patient, Doctor, MedicalRecord, Department, Prescription, Insurance, Appointment],
  migrations: ['migrations/*.ts'],
  synchronize: true, // set to false in production
});