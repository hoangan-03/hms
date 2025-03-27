import { ApiProperty } from "@nestjs/swagger";
import { Patient } from "@/entities/patient.entity";
import { PaginationMetaDto } from "@/commons/dtos/paging-meta.dto";

export class PaginatedPatientResponseDto {
  @ApiProperty({
    type: () => [Patient],
    description: "Array of patients",
  })
  data: Patient[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: "Pagination metadata",
  })
  pagination: PaginationMetaDto;
}
