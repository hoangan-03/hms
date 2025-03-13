import { MedicalRecord } from "./../../entities/medical-record.entity";
import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MedicalRecordService } from "./medical-record.service";
import { PagingQueryDto } from "../../commons/dtos/paging-query.dto";
import { JWTAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "@/modules/auth/decorators/user.decorator";
import { PaginatedMedicalRecordResponse } from "./interface/paging-response-medical-record.interface";
import { parseDateString } from "@/utils/parse-date-string";
import { PaginatedMedicalRecordResponseDto } from "./dtos/paging-response-medical-record.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiTags("medical-records")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("medical-records")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Get()
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: "Get current patient's medical records" })
  @ApiResponse({
    status: 200,
    description:
      "Return all medical records for the current user with pagination",
    type: PaginatedMedicalRecordResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getMedicalRecords(
    @CurrentUser("id") patientId: number,
    @Query() queryParams: PagingQueryDto
  ): Promise<PaginatedMedicalRecordResponse> {
    const dateFrom = queryParams.dateFrom
      ? parseDateString(queryParams.dateFrom)
      : undefined;
    const dateTo = queryParams.dateTo
      ? parseDateString(queryParams.dateTo)
      : undefined;

    return this.medicalRecordService.getMedicalRecords(
      patientId,
      {
        page: queryParams.page,
        perPage: queryParams.perPage,
      },
      {
        dateFrom,
        dateTo,
      },
      queryParams.orderDirection || "DESC"
    );
  }

  @Get(":recordId")
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Get specific medical record" })
  @ApiResponse({
    status: 200,
    description: "Return specific medical record",
    type: MedicalRecord,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Record does not belong to this patient",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Medical record not found",
  })
  async getMedicalRecord(
    @CurrentUser("id") patientId: number,
    @Param("recordId", ParseIntPipe) recordId: number
  ): Promise<MedicalRecord> {
    const record = await this.medicalRecordService.getMedicalRecord(recordId);

    // Verify the record belongs to this patient
    if (record.patient.id !== patientId) {
      throw new UnauthorizedException(
        "This medical record does not belong to you"
      );
    }

    return record;
  }
}
