import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
  IsPositive,
  Min,
  IsEnum,
  IsInt,
  Matches,
  IsString,
} from "class-validator";

export class PagingQueryDto {
  @ApiPropertyOptional({ description: "Page number (starts at 1)", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: "Items per page", default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  perPage?: number = 10;

  @ApiPropertyOptional({
    description: "Start date (DD-MM-YYYY)",
    example: "01-05-2024",
  })
  @IsOptional()
  @IsString()
  @Matches(/^(\d{2})-(\d{2})-(\d{4})$/, {
    message: "dateFrom must be in format DD-MM-YYYY",
  })
  dateFrom?: string;

  @ApiPropertyOptional({
    description: "End date (DD-MM-YYYY)",
    example: "31-05-2025",
  })
  @IsOptional()
  @IsString()
  @Matches(/^(\d{2})-(\d{2})-(\d{4})$/, {
    message: "dateTo must be in format DD-MM-YYYY",
  })
  dateTo?: string;

  @ApiPropertyOptional({
    description: "Order direction",
    enum: ["ASC", "DESC"],
    default: "DESC",
  })
  @IsOptional()
  @IsEnum(["ASC", "DESC"])
  orderDirection?: "ASC" | "DESC" = "DESC";
}