import { CustomISOString } from '@app/common/core/validate/validation';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';

export class GetDataDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(CustomISOString)
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(CustomISOString)
  toDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  exportCsv?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  locationId?: number;
}
