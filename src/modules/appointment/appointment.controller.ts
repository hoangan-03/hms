import { PaginatedAppointmentResponseDto } from "./dtos/paging-response-appointment.dto";
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { Appointment } from "@/entities/appointment.entity";
import { AppointmentService } from "./appointment.service";
import { CurrentUser } from "@/modules/auth/decorators/user.decorator";
import { CreateAppointmentDto } from "./dtos/create-appointment.dto";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { PaginatedAppointmentResponse } from "./interface/paging-response-appointment.interface";
import { parseDateString } from "@/utils/parse-date-string";
import { PagingQueryDto } from "../../commons/dtos/paging-query.dto";

@ApiTags("appointments")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("appointments")
@UseInterceptors(ClassSerializerInterceptor)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: "Get current patient's appointments" })
  @ApiResponse({
    status: 200,
    description: "Return all appointments for the current user with pagination",
    type: PaginatedAppointmentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getMedicalRecords(
    @CurrentUser("id") patientId: number,
    @Query() queryParams: PagingQueryDto
  ): Promise<PaginatedAppointmentResponse> {
    const dateFrom = queryParams.dateFrom
      ? parseDateString(queryParams.dateFrom)
      : undefined;
    const dateTo = queryParams.dateTo
      ? parseDateString(queryParams.dateTo)
      : undefined;

    return this.appointmentService.getAppointments(
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

  @Post("/appiontments")
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: "Create a new appointment" })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 201,
    description: "Appointment created successfully",
    type: Appointment,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid input data",
  })
  async createAppointment(
    @Body() appointment: Appointment
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(appointment);
  }

  @Get("/appointments/:appointmentId")
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Get specific appointment" })
  @ApiResponse({
    status: 200,
    description: "Return specific appointment",
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Appointment or patient not found",
  })
  async getAppointment(
    @Param("appointmentId") appointmentId: number
  ): Promise<Appointment> {
    return this.appointmentService.getAppointment(appointmentId);
  }
}
