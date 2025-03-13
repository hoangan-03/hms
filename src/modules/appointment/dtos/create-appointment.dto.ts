import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  Max,
  MaxLength,
} from "class-validator";
import { Column } from "typeorm";

export class CreateAppointmentDto {
  @ApiProperty({
    example: "2025-03-12 10:00:00",
    description: "Appointment date and time",
    required: true,
  })
  @Column({ type: "timestamp", nullable: false })
  dateTime: Date;

  @ApiPropertyOptional({
    example: "General Checkup",
    description: "Appointment reason",
    required: false,
  })
  @Column({ type: "varchar", length: 255, nullable: true })
  @IsString()
  @IsOptional()
  reason?: string;
}
