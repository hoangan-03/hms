import { ApiProperty } from "@nestjs/swagger";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { PaginationMetaDto } from "@/commons/dtos/paging-meta.dto";



export class PaginatedMedicalRecordResponseDto {
  @ApiProperty({ 
    type: () => [MedicalRecord],
    description: "Array of medical records" 
  })
  data: MedicalRecord[];

  @ApiProperty({ 
    type: PaginationMetaDto,
    description: "Pagination metadata" 
  })
  pagination: PaginationMetaDto;
}