import { MedicalRecord } from "./../../entities/medical-record.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PatientService } from "../patient/patient.service";
// Add these interfaces for pagination and filtering

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    private readonly patientService: PatientService
  ) {}

  async getMedicalRecords(
    patientId: number,
    { page = 1, size = 10 }: PaginationParams = {},
    { dateFrom, dateTo }: DateRangeFilter = {},
    orderDirection: "ASC" | "DESC" = "DESC"
  ): Promise<PaginatedResult<MedicalRecord>> {
    // Validate patient exists
    await this.patientService.getOne({ where: { id: patientId } });

    // Build query with where conditions
    const queryBuilder = this.medicalRecordRepository
      .createQueryBuilder("record")
      .leftJoinAndSelect("record.doctor", "doctor")
      .where("record.patient.id = :patientId", { patientId });

    // Add date range filters if provided
    if (dateFrom) {
      queryBuilder.andWhere("record.date >= :dateFrom", { dateFrom });
    }
    if (dateTo) {
      queryBuilder.andWhere("record.date <= :dateTo", { dateTo });
    }

    // Add ordering by date
    queryBuilder.orderBy("record.date", orderDirection);

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Add pagination
    const skip = (page - 1) * size;
    queryBuilder.skip(skip).take(size);

    // Execute query
    const records = await queryBuilder.getMany();

    // Return paginated result
    return {
      data: records,
      meta: {
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
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
