import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetAqiDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  locationId?: number;
}
