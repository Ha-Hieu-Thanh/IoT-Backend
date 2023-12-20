import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ required: false })
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  lat?: string;

  @ApiProperty({ required: false })
  @IsString()
  long?: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;
}
