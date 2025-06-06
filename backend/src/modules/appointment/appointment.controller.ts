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
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Patch,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
    ApiQuery,
} from "@nestjs/swagger";
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
import { PaginatedAppointmentResponseDto } from "./dtos/paging-response-appointment.dto";
import { Doctor } from "@/entities/doctor.entity";
import { TimeSlot } from "./enums/time-slot.enum";
import { DoctorResponseDto } from "./dtos/doctor-response.dto";

@ApiTags("appointments")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("appointments")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    @Get()
    @Roles(Role.PATIENT, Role.DOCTOR)
    @ApiOperation({
        summary:
            "Get current patient's/doctor's appointments - Role: Doctor/Patient",
    })
    @ApiResponse({
        status: 200,
        description:
            "Return all appointments for the current patient/doctor with pagination",
        type: PaginatedAppointmentResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized - Invalid or missing token",
    })
    async getAppointments(
        @CurrentUser("id") id: number,
        @Query() queryParams: PagingQueryDto
    ): Promise<PaginatedAppointmentResponse> {
        const dateFrom = queryParams.dateFrom
            ? parseDateString(queryParams.dateFrom)
            : undefined;
        const dateTo = queryParams.dateTo
            ? parseDateString(queryParams.dateTo)
            : undefined;

        return this.appointmentService.getAppointments(
            id,
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

    @Get("/doctor")
    @Roles(Role.PATIENT, Role.DOCTOR)
    @ApiOperation({
        summary:
            "Get current patient's/doctor's appointments - Role: Doctor/Patient",
    })
    @ApiResponse({
        status: 200,
        description:
            "Return all appointments for the current patient/doctor with pagination",
        type: PaginatedAppointmentResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized - Invalid or missing token",
    })
    async getAppointmentsOfDoctor(
        @CurrentUser("id") id: number,
        @Query() queryParams: PagingQueryDto
    ): Promise<PaginatedAppointmentResponse> {
        const dateFrom = queryParams.dateFrom
            ? parseDateString(queryParams.dateFrom)
            : undefined;
        const dateTo = queryParams.dateTo
            ? parseDateString(queryParams.dateTo)
            : undefined;

        return this.appointmentService.getAppointmentOfDoctor(
            id,
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

    @Post()
    @Roles(Role.PATIENT)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create a new appointment - Role: Patient" })
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
    @ApiResponse({
        status: 401,
        description: "Unauthorized - Invalid or missing token",
    })
    async createAppointment(
        @CurrentUser("id") patientId: number,
        @Body() appointmentDto: CreateAppointmentDto
    ): Promise<Appointment> {
        return this.appointmentService.createAppointment(
            patientId,
            appointmentDto
        );
    }

    @Get("available-doctors")
    @Roles(Role.PATIENT)
    @ApiOperation({
        summary:
            "Get available doctors for a specific date and time slot - Role: Patient",
    })
    @ApiQuery({
        name: "date",
        required: true,
        type: String,
        description: "Date in format YYYY-MM-DD",
    })
    @ApiQuery({
        name: "timeSlot",
        required: true,
        enum: TimeSlot,
        description: "Time slot",
    })
    @ApiQuery({
        name: "departmentId",
        required: false,
        type: Number,
        description: "Optional department ID filter",
    })
    @ApiResponse({
        status: 200,
        description: "Returns a list of available doctors",
        type: [DoctorResponseDto],
    })
    async getAvailableDoctors(
        @Query("date") date: string,
        @Query("timeSlot") timeSlot: TimeSlot,
        @Query("departmentId") departmentId?: number
    ): Promise<Doctor[]> {
        return this.appointmentService.getAvailableDoctorsForTimeSlot(
            date,
            timeSlot,
            departmentId
        );
    }

    @Get("available-time-slots")
    @Roles(Role.PATIENT)
    @ApiOperation({
        summary:
            "Get available time slots for a specific doctor on a specific date - Role: Patient",
    })
    @ApiQuery({
        name: "doctorId",
        required: true,
        type: Number,
        description: "Doctor ID",
    })
    @ApiQuery({
        name: "date",
        required: true,
        type: String,
        description: "Date in format YYYY-MM-DD",
    })
    @ApiResponse({
        status: 200,
        description: "Returns a list of available time slots",
        type: [String],
    })
    async getAvailableTimeSlots(
        @Query("doctorId", ParseIntPipe) doctorId: number,
        @Query("date") date: string
    ): Promise<TimeSlot[]> {
        return this.appointmentService.getAvailableTimeSlotsForDoctor(
            doctorId,
            date
        );
    }

    @Get("check-availability")
    @Roles(Role.PATIENT)
    @ApiOperation({
        summary:
            "Check if a time slot is available for a specific doctor - Role: Patient",
    })
    @ApiQuery({
        name: "doctorId",
        required: true,
        type: Number,
        description: "Doctor ID",
    })
    @ApiQuery({
        name: "date",
        required: true,
        type: String,
        description: "Date in format YYYY-MM-DD",
    })
    @ApiQuery({
        name: "timeSlot",
        required: true,
        enum: TimeSlot,
        description: "Time slot",
    })
    @ApiResponse({
        status: 200,
        description: "Returns whether the time slot is available",
        schema: {
            type: "object",
            properties: {
                available: { type: "boolean" },
            },
        },
    })
    async checkTimeSlotAvailability(
        @Query("doctorId") doctorId: number,
        @Query("date") date: string,
        @Query("timeSlot") timeSlot: TimeSlot
    ): Promise<{ available: boolean }> {
        console.log("doctorId", doctorId);

        const isAvailable = await this.appointmentService.isTimeSlotAvailable(
            doctorId,
            date,
            timeSlot
        );
        return { available: isAvailable };
    }

    @Patch(":appointmentId/cancel")
    @Roles(Role.DOCTOR, Role.PATIENT)
    @ApiOperation({ summary: "Cancel appointment - Role: Doctor/Patient" })
    @ApiResponse({
        status: 200,
        description: "Appointment canceled successfully",
        type: Appointment,
    })
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
        description: "Not Found - Appointment not found",
    })
    async cancelAppointment(
        @Param("appointmentId", ParseIntPipe) appointmentId: number
    ): Promise<Appointment> {
        return this.appointmentService.cancelAppointment(appointmentId);
    }

    @Patch(":appointmentId/confirm")
    @Roles(Role.DOCTOR)
    @ApiOperation({ summary: "Confirm appointment - Role: Doctor" })
    @ApiResponse({
        status: 200,
        description: "Appointment confirmed successfully",
        type: Appointment,
    })
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
        description: "Not Found - Appointment not found",
    })
    async confirmAppointment(
        @Param("appointmentId", ParseIntPipe) appointmentId: number
    ): Promise<Appointment> {
        return this.appointmentService.confirmAppointment(appointmentId);
    }

    @Get(":appointmentId")
    @Roles(Role.PATIENT, Role.DOCTOR)
    @ApiOperation({
        summary: "Get specific appointment - Role: Doctor/Patient",
    })
    @ApiResponse({
        status: 200,
        description: "Return specific appointment",
        type: Appointment,
    })
    @ApiResponse({
        status: 404,
        description: "Not Found - Appointment not found",
    })
    async getAppointment(
        @Param("appointmentId", ParseIntPipe) appointmentId: number
    ): Promise<Appointment> {
        return this.appointmentService.getAppointment(appointmentId);
    }

    @Patch(":appointmentId")
    @Roles(Role.PATIENT)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Update an appointment - Role: Patient" })
    @ApiBody({ type: CreateAppointmentDto })
    @ApiResponse({
        status: 200,
        description: "Appointment updated successfully",
        type: Appointment,
    })
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
        description: "Not Found - Appointment not found",
    })
    async updateAppointment(
        @CurrentUser("id") patientId: number,
        @Param("appointmentId", ParseIntPipe) appointmentId: number,
        @Body() appointmentDto: CreateAppointmentDto
    ): Promise<Appointment> {
        return this.appointmentService.rescheduleAppointment(
            patientId,
            appointmentId,
            appointmentDto
        );
    }
}
