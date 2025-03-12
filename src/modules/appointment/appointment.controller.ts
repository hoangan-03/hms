import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, PartialType } from "@nestjs/swagger";
import { Appointment } from "@/entities/appointment.entity";
import { AppointmentService } from "./appointment.service";

@ApiTags("patients")
@Controller("patients")
export class AppointmentController {
  constructor(private readonly patientService: AppointmentService) {}


  @Get(":id/appointments")
  @ApiOperation({ summary: "Get patient's appointments" })
  @ApiResponse({ 
    status: 200, 
    description: "Return all appointments for the patient", 
    type: [Appointment] 
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Patient not found with the provided ID",
  })
  async getAppointments(@Param("id") id: number): Promise<Appointment[]> {
    return this.patientService.getAppointments(id);
  }

  @Post("/appiontments")
  @ApiOperation({ summary: "Create a new appointment" })
  @ApiBody({ type: PartialType(Appointment) })
  @ApiResponse({ 
    status: 201, 
    description: "Appointment created successfully", 
    type: Appointment 
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid input data",
  })
  async createAppointment(@Body() appointment: Appointment): Promise<Appointment> {
    return this.patientService.createAppointment(appointment);
  }

  @Get(":id/appointments/:appointmentId")
  @ApiOperation({ summary: "Get specific appointment" })
  @ApiResponse({ 
    status: 200, 
    description: "Return specific appointment", 
    type: Appointment 
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Appointment or patient not found",
  })
  async getAppointment(
    @Param("appointmentId") appointmentId: number
  ): Promise<Appointment> {
    return this.patientService.getAppointment(appointmentId);
  }

  
}