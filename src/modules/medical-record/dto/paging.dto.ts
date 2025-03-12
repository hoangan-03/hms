import { ApiQuery } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
  IsPositive,
  Min,
  IsDateString,
  IsEnum,
} from "class-validator";

// Add DTO classes for query parameters
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  size?: number;
}

export class DateRangeDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  @IsDateString()
  dateTo?: Date;
}

export class OrderDirectionDto {
  @IsOptional()
  @IsEnum(["ASC", "DESC"])
  orderDirection?: "ASC" | "DESC";
}
