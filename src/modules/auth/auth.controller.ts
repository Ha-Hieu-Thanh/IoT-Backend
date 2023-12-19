import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('/verify-code')
  @ApiOperation({ summary: 'Verify code' })
  async verifyCode(@Body() body: VerifyCodeDto) {
    return await this.authService.verifyCode(body);
  }
}
