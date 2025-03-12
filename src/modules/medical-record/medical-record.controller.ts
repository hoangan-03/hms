import { MedicalRecord } from "./../../entities/medical-record.entity";
import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { MedicalRecordService } from "./medical-record.service";
import { DateRangeDto, OrderDirectionDto, PaginationDto } from "./dto/paging.dto";

@ApiTags("medical-records")
@Controller("medical-records")
export class MedicalRecordController {
  constructor(private readonly medicalrecordService: MedicalRecordService) {}

  @Get(":id/medical-records")
  @ApiOperation({ summary: "Get patient's medical records" })
  @ApiResponse({
    status: 200,
    description: "Return all medical records for the patient with pagination",
    type: MedicalRecord,
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Patient not found with the provided ID",
  })
  async getMedicalRecords(
    @Param("id", ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
    @Query() dateRangeDto: DateRangeDto,
    @Query() orderDto: OrderDirectionDto
  ): Promise<PaginatedResult<MedicalRecord>> {
    return this.medicalrecordService.getMedicalRecords(
      id,
      paginationDto,
      dateRangeDto,
      orderDto.orderDirection || "DESC"
    );
  }

  @Get(":id/medical-record/:medicalRecordId")
  @ApiOperation({ summary: "Get specific medical record" })
  @ApiResponse({
    status: 200,
    description: "Return specific medical record",
    type: MedicalRecord,
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Medical record or patient not found",
  })
  async getMedicalRecord(
    @Param("medicalRecordId", ParseIntPipe) medicalRecordId: number
  ): Promise<MedicalRecord> {
    return this.medicalrecordService.getMedicalRecord(medicalRecordId);
  }
}
