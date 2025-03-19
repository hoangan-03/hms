import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsPositive,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { TimeSlot } from "../enums/time-slot.enum";

export class CreateAppointmentDto {
  @ApiProperty({
    example: "2025-03-12T10:00:00Z",
    description: "Appointment date and time (ISO format)",
    required: true,
  })
  date: Date;

  @ApiProperty({
    example: 'a1_2',
    description: "Appointment time slot",
    required: true,
  })
  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;

  @ApiProperty({
    example: 1,
    description: "Doctor ID",
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  doctorId: number;

  @ApiPropertyOptional({
    example: "General Checkup",
    description: "Appointment reason",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  reason: string;

  @ApiPropertyOptional({
    example: "Recurring headaches and fatigue",
    description: "Patient notes about symptoms or concerns",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;
}