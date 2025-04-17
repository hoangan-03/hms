import { MedicalRecord } from "./../../entities/medical-record.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PatientService } from "../patient/patient.service";
import {
  DateRangeFilter,
  PaginatedMedicalRecordResponse,
  PaginationParams,
} from "./interface/paging-response-medical-record.interface";
import { formatStartDate } from "@/utils/parse-date-string";
import { UpdateMedicalRecordDto } from "./dtos/update-medical-record.dto";

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    private readonly patientService: PatientService
  ) {}
  async getAllMedicalRecords(
    { page = 1, perPage = 10 }: PaginationParams = {},
    { dateFrom, dateTo }: DateRangeFilter = {},
    orderDirection: "ASC" | "DESC" = "DESC"
  ): Promise<PaginatedMedicalRecordResponse> {
    const queryBuilder = this.medicalRecordRepository
      .createQueryBuilder("record")
      .leftJoinAndSelect("record.doctor", "doctor")
      .leftJoinAndSelect("record.patient", "patient")
      .leftJoinAndSelect("record.prescriptions", "prescription");

    if (dateFrom) {
      queryBuilder.andWhere("record.recordDate > :dateFrom", {
        dateFrom: formatStartDate(dateFrom),
      });
    }
    if (dateTo) {
      const nextDay = new Date(dateTo);
      nextDay.setDate(nextDay.getDate() + 2);

      queryBuilder.andWhere("record.recordDate < :dateTo", {
        dateTo: formatStartDate(nextDay),
      });
    }

    queryBuilder.orderBy("record.recordDate", orderDirection);

    const totalItems = await queryBuilder.getCount();

    const skip = (page - 1) * perPage;
    queryBuilder.skip(skip).take(perPage);

    const records = await queryBuilder.getMany();

    return {
      data: records,
      pagination: {
        totalItems,
        page,
        perPage,
        totalPages: Math.ceil(totalItems / perPage),
      },
    };
  }

  async getMedicalRecords(
    patientId: number,
    { page = 1, perPage = 10 }: PaginationParams = {},
    { dateFrom, dateTo }: DateRangeFilter = {},
    orderDirection: "ASC" | "DESC" = "DESC"
  ): Promise<PaginatedMedicalRecordResponse> {
    await this.patientService.getOne({ where: { id: patientId } });

    const queryBuilder = this.medicalRecordRepository
      .createQueryBuilder("record")
      .leftJoinAndSelect("record.doctor", "doctor")
      .leftJoinAndSelect("record.patient", "patient")
      .leftJoinAndSelect("record.prescriptions", "prescription")
      .where("patient.id = :patientId", { patientId });

    if (dateFrom) {
      queryBuilder.andWhere("record.recordDate > :dateFrom", {
        dateFrom: formatStartDate(dateFrom),
      });
    }
    if (dateTo) {
      const nextDay = new Date(dateTo);
      nextDay.setDate(nextDay.getDate() + 2);

      queryBuilder.andWhere("record.recordDate < :dateTo", {
        dateTo: formatStartDate(nextDay),
      });
    }

    queryBuilder.orderBy("record.recordDate", orderDirection);

    const totalItems = await queryBuilder.getCount();

    const skip = (page - 1) * perPage;
    queryBuilder.skip(skip).take(perPage);

    const records = await queryBuilder.getMany();

    return {
      data: records,
      pagination: {
        totalItems,
        page,
        perPage,
        totalPages: Math.ceil(totalItems / perPage),
      },
    };
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

  async updateMedicalRecord(
    id: number,
    updateData: UpdateMedicalRecordDto
  ): Promise<MedicalRecord> {
    const record = await this.getMedicalRecord(id);

    // Update basic fields if provided
    if (updateData.diagnosis) {
      record.diagnosis = updateData.diagnosis;
    }

    if (updateData.recordDate) {
      record.recordDate = new Date(updateData.recordDate);
    }

    // Update doctor if provided
    if (updateData.doctorId) {
      record.doctor = { id: updateData.doctorId } as any;
    }

    // Update patient if provided
    if (updateData.patientId) {
      record.patient = { id: updateData.patientId } as any;
    }

    // Save the updated record first to ensure relationships
    await this.medicalRecordRepository.save(record);

    // Handle prescriptions updates if provided
    if (updateData.prescriptions && updateData.prescriptions.length > 0) {
      // Get current prescriptions (we already have them from getMedicalRecord)
      const currentPrescriptions = record.prescriptions || [];

      // Process each prescription in the update DTO
      for (const prescriptionDto of updateData.prescriptions) {
        if (prescriptionDto.id) {
          // Update existing prescription
          const existingIndex = currentPrescriptions.findIndex(
            (p) => p.id === prescriptionDto.id
          );

          if (existingIndex >= 0) {
            // Update existing prescription
            const prescription = currentPrescriptions[existingIndex];
            prescription.dosage = prescriptionDto.dosage;
            await this.medicalRecordRepository.manager.save(prescription);
          }
        } else {
          // Create new prescription
          const newPrescription = this.medicalRecordRepository.manager.create(
            "Prescription",
            {
              dosage: prescriptionDto.dosage,
              medicalRecord: { id: record.id },
            }
          );

          await this.medicalRecordRepository.manager.save(newPrescription);
        }
      }
    }

    // Return the fully updated record with all relations
    return this.getMedicalRecord(id);
  }

  async deleteMedicalRecord(id: number): Promise<void> {
    const record = await this.getMedicalRecord(id);

    // Delete the record
    await this.medicalRecordRepository.remove(record);
  }
}
