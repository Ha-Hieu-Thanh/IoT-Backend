import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  subscriptionId: number;
}
