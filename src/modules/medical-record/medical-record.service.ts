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

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    private readonly patientService: PatientService
  ) {}
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
}
