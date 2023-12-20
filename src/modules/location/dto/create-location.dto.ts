import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  lat: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  long: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;
}
