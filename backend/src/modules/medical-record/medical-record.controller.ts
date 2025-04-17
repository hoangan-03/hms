import { MedicalRecord } from "./../../entities/medical-record.entity";
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
  ClassSerializerInterceptor,
  UseInterceptors,
  ForbiddenException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
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
import { UpdateMedicalRecordDto } from "./dtos/update-medical-record.dto";

@ApiTags("medical-records")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("medical-records")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Get()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Get all medical records - Role: Doctor" })
  @ApiResponse({
    status: 200,
    description: "Return all medical records",
    type: PaginatedMedicalRecordResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden resource - You are not allowed to access this",
  })
  async getAllMedicalRecords(
    @Query() queryParams: PagingQueryDto
  ): Promise<PaginatedMedicalRecordResponse> {
    const dateFrom = queryParams.dateFrom
      ? parseDateString(queryParams.dateFrom)
      : undefined;
    const dateTo = queryParams.dateTo
      ? parseDateString(queryParams.dateTo)
      : undefined;

    return this.medicalRecordService.getAllMedicalRecords(
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

  @Get("/patient")
  @Roles(Role.PATIENT)
  @ApiOperation({
    summary: "Get current patient's medical records - Role: Patient",
  })
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
  @ApiOperation({ summary: "Get specific medical record - Role: Doctor" })
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
    description: "Forbidden resource - You are not allowed to access this",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Medical record not found",
  })
  async getMedicalRecord(
    @Param("recordId", ParseIntPipe) recordId: number
  ): Promise<MedicalRecord> {
    const record = await this.medicalRecordService.getMedicalRecord(recordId);

    return record;
  }

  @Put(":recordId")
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Update a medical record - Role: Doctor" })
  @ApiResponse({
    status: 200,
    description: "Medical record updated successfully",
    type: MedicalRecord,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden resource - You are not allowed to access this",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Medical record not found",
  })
  @ApiBody({ type: UpdateMedicalRecordDto })
  async updateMedicalRecord(
    @Param("recordId", ParseIntPipe) recordId: number,
    @Body() updateData: UpdateMedicalRecordDto,
    @CurrentUser("id") userId: number
  ): Promise<MedicalRecord> {
    const record = await this.medicalRecordService.getMedicalRecord(recordId);

    // Only allow the doctor who created the record to delete it
    if (record.doctor.id !== userId) {
      throw new ForbiddenException(
        "You can only update your own medical records"
      );
    }
    
    // Process the update
    return this.medicalRecordService.updateMedicalRecord(recordId, updateData);
  }

  @Delete(":recordId")
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Delete a medical record - Role: Doctor" })
  @ApiResponse({
    status: 200,
    description: "Medical record deleted successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden resource - You are not allowed to access this",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Medical record not found",
  })
  async deleteMedicalRecord(
    @Param("recordId", ParseIntPipe) recordId: number,
    @CurrentUser("id") userId: number
  ): Promise<{ message: string }> {
    // Get the medical record first to check permissions
    const record = await this.medicalRecordService.getMedicalRecord(recordId);

    // Only allow the doctor who created the record to delete it
    if (record.doctor.id !== userId) {
      throw new ForbiddenException(
        "You can only delete your own medical records"
      );
    }

    // Process the deletion
    await this.medicalRecordService.deleteMedicalRecord(recordId);

    return { message: "Medical record deleted successfully" };
  }
}
