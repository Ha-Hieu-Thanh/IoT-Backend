import { CustomISOString } from '@app/common/core/validate/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';

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
