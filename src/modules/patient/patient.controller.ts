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

@ApiTags("patients")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("patients")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Get all patients" })
  @ApiResponse({
    status: 200,
    description: "Return all patients",
    type: [Patient],
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getList(): Promise<Patient[]> {
    return this.patientService.getAll();
  }
  
  @Get(":id")
  @ApiOperation({ summary: "Get patient by ID" })
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

  @Get("profile")
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: "Get current patient's profile" })
  @ApiResponse({
    status: 200,
    description: "Return current patient profile",
    type: Patient,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getProfile(@CurrentUser("id") userId: number): Promise<Patient> {
    return this.patientService.getOne({ where: { id: userId } });
  }

  @Patch("profile")
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: "Update current patient profile" })
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

  @Get("insurance")
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: "Get current patient's insurance information" })
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
  @ApiOperation({ summary: "Get current patient's billing records" })
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
  @ApiOperation({ summary: "Get specific billing record for current patient" })
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
