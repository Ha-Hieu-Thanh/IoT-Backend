import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDataDto {
  @IsNotEmpty()
  @IsNumber()
  locationId: number;

  @IsNotEmpty()
  @IsNumber()
  humidity: number;

  @IsNotEmpty()
  @IsNumber()
  temperature: number;

  @IsNotEmpty()
  @IsNumber()
  CO_concentration: number;

  @IsNotEmpty()
  @IsNumber()
  CO2_concentration: number;

  @IsNotEmpty()
  @IsNumber()
  NH3_concentration: number;

  @IsNotEmpty()
  @IsNumber()
  PM25_concentration: number;
}
