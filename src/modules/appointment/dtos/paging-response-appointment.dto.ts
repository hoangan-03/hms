import { ApiProperty } from "@nestjs/swagger";
import { Appointment } from "@/entities/appointment.entity";
import { PaginationMetaDto } from "@/commons/dtos/paging-meta.dto";

export class PaginatedAppointmentResponseDto {
  @ApiProperty({ 
    type: () => [Appointment],
    description: "Array of appointment records" 
  })
  data: Appointment[];

  @ApiProperty({ 
    type: PaginationMetaDto,
    description: "Pagination metadata" 
  })
  pagination: PaginationMetaDto;
}