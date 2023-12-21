import { CustomISOString } from '@app/common/core/validate/validation';
import { PageSizeDto } from '@app/common/helper/pagination';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAlertQueryDto extends PageSizeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(CustomISOString)
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(CustomISOString)
  toDate?: string;

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { each: true })
  userIds?: number[];

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { each: true })
  locationIds?: number[];
}
