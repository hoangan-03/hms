import { Controller, Body, Get, Param, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { Patient } from "@/entities/patient.entity";
import { PatientService } from "./patient.service";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { Insurance } from "@/entities/insurance.entity";
import { Billing } from "@/entities/billing.entity";
import { Prescription } from "@/entities/prescription.entity";

@ApiTags("patients")
@Controller("patients")
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

  @Get(":id")
  @ApiOperation({ summary: "Get patient by ID" })
  @ApiResponse({ status: 200, description: "Return patient by ID", type: Patient })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid input data",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Patient not found with the provided ID",
  })
  async getById(@Param("id") id: number): Promise<Patient> {
    return this.patientService.getOne({ where: { id } });
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Update patient' })
  @ApiBody({ type: Patient })
  @ApiResponse({ status: 200, description: "Return updated patient", type: Patient })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid credentials",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Patient not found with the provided ID",
  })
  async update(
    @Param("id") id: number,
    @Body() patient: Partial<Patient>
  ): Promise<Patient> {
    return this.patientService.updateProfile(id, patient);
  }

  @Get(":id/medical-records")
  @ApiOperation({ summary: "Get patient's medical records" })
  @ApiResponse({ 
    status: 200, 
    description: "Return all medical records for the patient", 
    type: [MedicalRecord] 
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Patient not found with the provided ID",
  })
  async getMedicalRecords(@Param("id") id: number): Promise<MedicalRecord[]> {
    return this.patientService.getMedicalRecords(id);
  }

  @Get(":id/medical-records/:recordId")
  @ApiOperation({ summary: "Get specific medical record" })
  @ApiResponse({ 
    status: 200, 
    description: "Return specific medical record", 
    type: MedicalRecord 
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Record or patient not found",
  })
  async getMedicalRecord(
    @Param("recordId") id: number
  ): Promise<MedicalRecord> {
    return this.patientService.getMedicalRecord(id);
  }

  @Get(":id/insurance")
  @ApiOperation({ summary: "Get patient's insurance information" })
  @ApiResponse({ 
    status: 200, 
    description: "Return insurance information", 
    type: Insurance 
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Insurance or patient not found",
  })
  async getInsurance(@Param("id") id: number): Promise<Insurance> {
    return this.patientService.getInsurance(id);
  }

  @Get(":id/billing")
  @ApiOperation({ summary: "Get patient's billing records" })
  @ApiResponse({ 
    status: 200, 
    description: "Return billing records", 
    type: [Billing] 
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Patient not found",
  })
  async getBillingRecords(@Param("id") id: number): Promise<Billing[]> {
    return this.patientService.getBillingRecords(id);
  }

  @Get(":id/billing/:billingId")
  @ApiOperation({ summary: "Get specific billing record" })
  @ApiResponse({ 
    status: 200, 
    description: "Return specific billing record", 
    type: Billing 
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Billing record not found",
  })
  async getBillingRecord(
    @Param("billingId") billingId: number
  ): Promise<Billing> {
    return this.patientService.getBillingRecord(billingId);
  }

  // @Get(":id/prescriptions")
  // @ApiOperation({ summary: "Get patient's prescriptions" })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: "Return prescriptions", 
  //   type: [Prescription] 
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: "Not Found - Patient not found",
  // })
  // async getPrescriptions(@Param("id") id: number): Promise<Prescription[]> {
  //   return this.patientService.getPrescriptions(id);
  // }

  @Get(":id/full-profile")
  @ApiOperation({
    summary: "Get patient's full profile including medical records, appointments, etc.",
  })
  @ApiResponse({ status: 200, description: "Full patient profile", type: Patient })
  async getFullProfile(@Param("id") id: number): Promise<any> {
    return this.patientService.getPatientWithFullProfile(id);
  }
}