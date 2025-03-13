import { 
  Controller, Body, Get, Param, Patch, 
  ClassSerializerInterceptor, UseInterceptors, 
  UseGuards,
  NotFoundException
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { Patient } from "@/entities/patient.entity";
import { PatientService } from "./patient.service";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { Insurance } from "@/entities/insurance.entity";
import { Billing } from "@/entities/billing.entity";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentPatient } from "../../decorators/patient.decorator";

@ApiTags("patients")
@Controller("patients")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth() 
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @ApiOperation({ summary: "Get all patients" })
  @ApiResponse({ status: 200, description: "Return all patients", type: [Patient] })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getList(): Promise<Patient[]> {
    return this.patientService.getAll();
  }

  @Get("profile")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Get current patient's profile" })
  @ApiResponse({ status: 200, description: "Return current patient profile", type: Patient })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getProfile(@CurrentPatient('id') userId: number): Promise<Patient> {
    return this.patientService.getOne({ where: { id: userId } });
  }

  // @Patch("profile")
  // @UseGuards(JWTAuthGuard)
  // @ApiOperation({ summary: 'Update current patient profile' })
  // @ApiBody({ type: UpdatePatientDto })
  // @ApiResponse({ status: 200, description: "Return updated patient profile", type: Patient })
  // @ApiResponse({
  //   status: 401,
  //   description: "Unauthorized - Invalid credentials",
  // })
  async updateProfile(
    @CurrentPatient('id') patientId: number,
    @Body() updateData: UpdatePatientDto
  ): Promise<Patient> {
    return this.patientService.updateProfile(patientId, updateData);
  }

  @Get("medical-records")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Get current patient's medical records" })
  @ApiResponse({ 
    status: 200, 
    description: "Return all medical records for the current patient", 
    type: [MedicalRecord] 
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getMedicalRecords(@CurrentPatient('id') userId: number): Promise<MedicalRecord[]> {
    return this.patientService.getMedicalRecords(userId);
  }

  @Get("medical-records/:recordId")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Get specific medical record for current patient" })
  @ApiResponse({ 
    status: 200, 
    description: "Return specific medical record", 
    type: MedicalRecord 
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Record not found",
  })
  async getMedicalRecord(
    @CurrentPatient('id') userId: number,
    @Param("recordId") recordId: number
  ): Promise<MedicalRecord> {
    // First verify the record belongs to this patient
    const record = await this.patientService.getMedicalRecord(recordId);
    if (record.patient.id !== userId) {
      throw new NotFoundException('Medical record not found or does not belong to the current patient');
    }
    return record;
  }

  @Get("insurance")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Get current patient's insurance information" })
  @ApiResponse({ 
    status: 200, 
    description: "Return insurance information", 
    type: Insurance 
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Insurance not found",
  })
  async getInsurance(@CurrentPatient('id') userId: number): Promise<Insurance> {
    return this.patientService.getInsurance(userId);
  }

  @Get("billing")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Get current patient's billing records" })
  @ApiResponse({ 
    status: 200, 
    description: "Return billing records", 
    type: [Billing] 
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getBillingRecords(@CurrentPatient('id') userId: number): Promise<Billing[]> {
    return this.patientService.getBillingRecords(userId);
  }

  @Get("billing/:billingId")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Get specific billing record for current patient" })
  @ApiResponse({ 
    status: 200, 
    description: "Return specific billing record", 
    type: Billing 
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
    @CurrentPatient('id') userId: number,
    @Param("billingId") billingId: number
  ): Promise<Billing> {
    const billing = await this.patientService.getBillingRecord(billingId);
    if (billing.patient.id !== userId) {
      throw new NotFoundException('Billing record not found or does not belong to the current patient');
    }
    return billing;
  }

  // @Get(":id")
  // @ApiOperation({ summary: "Get patient by ID (Admin only)" })
  // @ApiResponse({ status: 200, description: "Return patient by ID", type: Patient })
  // @ApiResponse({
  //   status: 404,
  //   description: "Not Found - Patient not found with the provided ID",
  // })
  // async getById(@Param("id") id: number): Promise<Patient> {
  //   return this.patientService.getOne({ where: { id } });
  // }
}