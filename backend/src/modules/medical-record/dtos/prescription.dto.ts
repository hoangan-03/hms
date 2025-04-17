import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class PrescriptionDto {
  @ApiProperty({
    description: "Prescription ID (optional, only for updates)",
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: "Dosage instructions",
    example: "500mg twice daily for 10 days",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  dosage: string;
}
