import { CustomISOString } from '@app/common/core/validate/validation';
import { EIndexType } from '@app/common/helper/const';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, Validate } from 'class-validator';

export class GetDataDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(CustomISOString)
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(CustomISOString)
  toDate?: string;
}
