import { ApiProperty } from "@nestjs/swagger";

export class PaginationMetaDto {
    @ApiProperty({ 
      example: 1,
      description: "Current page number" 
    })
    page: number;
  
    @ApiProperty({ 
      example: 10,
      description: "Number of items per page" 
    })
    perPage: number;
  
    @ApiProperty({ 
      example: 100,
      description: "Total number of items available" 
    })
    totalItems: number;
  
    @ApiProperty({ 
      example: 10,
      description: "Total number of pages" 
    })
    totalPages: number;
  }