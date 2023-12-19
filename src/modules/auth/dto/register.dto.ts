import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa và một số',
  })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumberString({}, { message: 'Số điện thoại chỉ được chứa các chữ số' })
  @Length(10, 10, {
    message: 'Số điện thoại phải chứa đúng 10 chữ số',
  })
  phone: string;
}
