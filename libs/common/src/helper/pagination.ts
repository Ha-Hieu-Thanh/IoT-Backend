import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PageSizeDto {
  /**
   * index page
   * @example 1
   */
  @ApiProperty({ required: false })
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  pageIndex?: number;

  /**
   * page size
   * @example 10
   */
  @ApiProperty({ required: false })
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  pageSize?: number;
}
