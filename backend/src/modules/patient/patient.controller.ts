import {
  Controller,
  Body,
  Get,
  Param,
  Patch,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  NotFoundException,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Patient } from "@/entities/patient.entity";
import { PatientService } from "./patient.service";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { Insurance } from "@/entities/insurance.entity";
import { Billing } from "@/entities/billing.entity";
import { UpdatePatientDto } from "./dtos/update-patient.dto";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { PagingQueryDto } from "@/commons/dtos/paging-query.dto";
import { parseDateString } from "@/utils/parse-date-string";
import { PaginatedPatientResponseDto } from "./dtos/paginated-patient-response.dto";

@ApiTags("patients")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("patients")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Get all patients - Role: Doctor" })
  @ApiOperation({
    summary: "Get all patient with pagination - Role: Doctor",
  })
  @ApiResponse({
    status: 200,
    description: "Return all patientwith pagination",
    type: PaginatedPatientResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getPatients(
    @Query() queryParams: PagingQueryDto
  ): Promise<PaginatedPatientResponseDto> {
    return this.patientService.getPatients({
      page: queryParams.page,
      perPage: queryParams.perPage,
    });
  }

  @Get(":id")
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Get patient by ID - Role: Doctor" })
  @ApiResponse({
    status: 200,
    description: "Return patient by ID",
    type: Patient,
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Patient not found with the provided ID",
  })
  async getById(@Param("id") id: number): Promise<Patient> {
    return this.patientService.getOne({ where: { id } });
  }

  @Patch("profile")
  @Roles(Role.PATIENT)
  @ApiOperation({
    summary: "Update current patient profile - Role: Patient",
  })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({
    status: 200,
    description: "Return updated patient profile",
    type: Patient,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid credentials",
  })
  async updateProfile(
    @CurrentUser("id") patientId: number,
    @Body() updateData: UpdatePatientDto
  ): Promise<Patient> {
    return this.patientService.updateProfile(patientId, updateData);
  }

  @Patch("profile/doctor-update/:id")
  @Roles(Role.DOCTOR)
  @ApiOperation({
    summary: "Update patient profile by doctor - Role: Doctor",
  })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({
    status: 200,
    description: "Return updated patient profile",
    type: Patient,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid credentials",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden resource - You are not allowed to access this",
  })
  async updateProfileByDoctor(
    @Param("id") patientId: number,
    @Body() updateData: UpdatePatientDto
  ): Promise<Patient> {
    return this.patientService.updateProfile(patientId, updateData);
  }

  @Get("insurance")
  @Roles(Role.PATIENT)
  @ApiOperation({
    summary: "Get current patient's insurance information - Role: Patient",
  })
  @ApiResponse({
    status: 200,
    description: "Return insurance information",
    type: Insurance,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Insurance not found",
  })
  async getInsurance(@CurrentUser("id") userId: number): Promise<Insurance> {
    return this.patientService.getInsurance(userId);
  }

  @Get("billing")
  @Roles(Role.PATIENT)
  @ApiOperation({
    summary: "Get current patient's billing records - Role: Paient",
  })
  @ApiResponse({
    status: 200,
    description: "Return billing records",
    type: [Billing],
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getBillingRecords(
    @CurrentUser("id") userId: number
  ): Promise<Billing[]> {
    return this.patientService.getBillingRecords(userId);
  }

  @Get("billing/:billingId")
  @Roles(Role.PATIENT)
  @ApiOperation({
    summary: "Get specific billing record for current patient - Role: Patient",
  })
  @ApiResponse({
    status: 200,
    description: "Return specific billing record",
    type: Billing,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Billing record not found",
  })
  async getBillingRecord(
    @CurrentUser("id") userId: number,
    @Param("billingId") billingId: number
  ): Promise<Billing> {
    const billing = await this.patientService.getBillingRecord(billingId);
    if (billing.patient.id !== userId) {
      throw new NotFoundException(
        "Billing record not found or does not belong to the current patient"
      );
    }
    return billing;
  }
}
