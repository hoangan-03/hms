import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
} from "class-validator";
import { PrescriptionDto } from "./prescription.dto";

export class UpdateMedicalRecordDto {
  @ApiPropertyOptional({
    description: "Medical diagnosis",
    example: "Hypertension with mild cardiac symptoms",
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({
    description: "Date of the medical record",
    example: "2023-05-15",
    format: "date",
  })
  @IsDateString()
  @IsOptional()
  recordDate?: string;

  @ApiPropertyOptional({
    description: "Doctor ID",
    example: 5,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  doctorId?: number;

  @ApiPropertyOptional({
    description: "Patient ID",
    example: 12,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  patientId?: number;

  @ApiPropertyOptional({
    description: "List of prescriptions",
    type: [PrescriptionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionDto)
  @IsOptional()
  prescriptions?: PrescriptionDto[];
}
