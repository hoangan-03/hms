import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOneOptions } from "typeorm";
import { Patient } from "@/entities/patient.entity";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { Appointment } from "@/entities/appointment.entity";
import { Insurance } from "@/entities/insurance.entity";
import { Billing } from "@/entities/billing.entity";
import { Prescription } from "@/entities/prescription.entity";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Insurance)
    private readonly insuranceRepository: Repository<Insurance>,
    @InjectRepository(Billing)
    private readonly billingRepository: Repository<Billing>,
  ) {}

  // Patient Management
  async create(data: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create(data);
    return this.patientRepository.save(patient);
  }

  async getAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async getOne(options: FindOneOptions<Patient>): Promise<Patient> {
    const patient = await this.patientRepository.findOne(options);
    if (!patient) {
      const identifier = options.where
        ? Object.entries(options.where)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "unknown";

      throw new NotFoundException(`There isn't any patient with id: ${identifier}`);
    }
    return patient;
  }

  // Profile Management
  async updateProfile(id: number, updates: Partial<Patient>): Promise<Patient> {
    const patient = await this.getOne({ where: { id } });
    this.patientRepository.merge(patient, updates);
    return this.patientRepository.save(patient);
  }

  // Medical Records
  async getMedicalRecords(patientId: number): Promise<MedicalRecord[]> {
    await this.getOne({ where: { id: patientId } }); // Verify patient exists
    return this.medicalRecordRepository.find({
      where: { patient: { id: patientId } },
      relations: ["doctor"],
    });
  }

  async getMedicalRecord(id: number): Promise<MedicalRecord> {
    const record = await this.medicalRecordRepository.findOne({
      where: { id },
      relations: ["doctor", "patient", "prescriptions"],
    });
    
    if (!record) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }
    
    return record;
  }

  // Insurance
  async getInsurance(patientId: number): Promise<Insurance> {
    await this.getOne({ where: { id: patientId } }); // Verify patient exists
    
    const insurance = await this.insuranceRepository.findOne({
      where: { patient: { id: patientId } }
    });
    
    if (!insurance) {
      throw new NotFoundException(`No insurance found for patient with ID ${patientId}`);
    }
    
    return insurance;
  }

  // Billing
  async getBillingRecords(patientId: number): Promise<Billing[]> {
    await this.getOne({ where: { id: patientId } }); // Verify patient exists
    return this.billingRepository.find({
      where: { patient: { id: patientId } },
      order: { billingDate: "DESC" },
    });
  }

  async getBillingRecord(id: number): Promise<Billing> {
    const billing = await this.billingRepository.findOne({
      where: { id },
      relations: ["patient"],
    });
    
    if (!billing) {
      throw new NotFoundException(`Billing record with ID ${id} not found`);
    }
    
    return billing;
  }

  // Prescriptions
  // async getPrescriptions(patientId: number): Promise<Prescription[]> {
  //   await this.getOne({ where: { id: patientId } }); // Verify patient exists
    
  //   const records = await this.medicalRecordRepository.find({
  //     where: { patient: { id: patientId } },
  //     relations: ["prescriptions", "prescriptions.medicalRecord"],
  //   });
    
  //   const prescriptions: Prescription[] = [];
  //   records.forEach(record => {
  //     if (record.prescriptions && record.prescriptions.length) {
  //       prescriptions.push(...record.prescriptions);
  //     }
  //   });
    
  //   return prescriptions;
  // }

  // Advanced Queries
  async getPatientWithFullProfile(id: number): Promise<any> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: [
        "medicalRecords", 
        "medicalRecords.doctor",
        "medicalRecords.prescriptions", 
        "appointments",
        "appointments.doctor",
        "appointments.doctor.department",
        "insurance",
        "billings"
      ]
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    
    return patient;
  }
}