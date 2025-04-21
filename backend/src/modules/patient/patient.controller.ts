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
  Post,
  HttpCode,
  HttpStatus,
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
import { UpdatePatientDto } from "./dtos/update-patient.dto";
import { CreatePatientDto } from "./dtos/create-patient.dto";
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

  @Post("register")
  @Roles(Role.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Register a new patient - Role: Doctor",
  })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: "Patient registered successfully",
    type: Patient,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid input data or username already exists",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden resource - You are not allowed to access this",
  })
  async registerPatient(
    @Body() createPatientDto: CreatePatientDto
  ): Promise<Patient> {
    return this.patientService.registerPatient(createPatientDto);
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

 
}
