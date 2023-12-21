import { User } from '@app/common/database/mysql/entities/User';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { Exception } from '@app/common/core/exception';
import { ErrorCode } from '@app/common/helper/error';
import * as bcrypt from 'bcrypt';
import { JwtAuthenticationService } from '@app/common/jwt-authentication';
import { RegisterDto } from './dto/register.dto';
import { TwilioService } from '@app/common/twilio/twilio.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SMSQueue } from '@app/common/queue/sms.processor';
import { SESQueue } from '@app/common/queue/ses.processor';
import { EStatus } from '@app/common/helper/const';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { getUTCTimeNow } from '@app/common/helper/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtAuthenticationService: JwtAuthenticationService,
    @InjectQueue('SMSQueue') private readonly smsQueue: Queue,
    @InjectQueue('SESQueue') private readonly sesQueue: Queue,
  ) {}

  async login(body: LoginDto) {
    const { email, password } = body;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) return new Exception(ErrorCode.UserNotExist, 'User not found');
    if (!bcrypt.compare(password, user.password)) {
      return new Exception(ErrorCode.PasswordNotMatch, 'Password not match');
    }

    const accessToken = this.jwtAuthenticationService.generateAccessToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const refreshToken = this.jwtAuthenticationService.generateRefreshToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(body: RegisterDto) {
    const { email, password, name, phone } = body;
    const user = await this.userRepository.findOne({
      where: { email, status: EStatus.ACTIVE },
    });
    if (user) return new Exception(ErrorCode.UserExist, 'User already exist');
    // gen random code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    // save code to database
    await this.userRepository.insert({
      email,
      password: bcrypt.hashSync(password, 10),
      name,
      phone,
      verifyCode,
    });
    // send code to phone and email
    this.smsQueue.add('SendOTP', {
      phone,
      body: `Your verify code: ${verifyCode}`,
    });
    this.sesQueue.add('SendOTP', {
      to: [email],
      subject: 'Verify Code',
      body: `Your verify code: ${verifyCode}`,
    });
    return true;
  }

  async verifyCode(body: VerifyCodeDto) {
    const { email, code } = body;
    const user = await this.userRepository.findOne({
      where: { email },
      // limit 1 and desc
      order: { updatedAt: 'DESC' },
    });
    if (!user) throw new Exception(ErrorCode.UserNotExist, 'User not found');
    // check time to verify code is in 2 minutes.
    const now = new Date().getTime();
    const updatedAt = user.updatedAt.getTime();
    const time = now - updatedAt;

    if (time > 2 * 60 * 1000) {
      throw new Exception(ErrorCode.VerifyCodeExpired, 'Verify code expired');
    }
    if (user.verifyCode !== code) {
      throw new Exception(
        ErrorCode.VerifyCodeNotMatch,
        'Verify code not match',
      );
    }

    // delete other user have email and id difference user.id
    await this.userRepository.delete({
      email,
      id: Not(user.id),
    });

    await this.userRepository.update({ email }, { status: EStatus.ACTIVE });
    return true;
  }

  async refreshToken(refreshToken: string) {
    const { id, email, phone, role } =
      this.jwtAuthenticationService.verifyRefreshToken(refreshToken);
    const accessToken = this.jwtAuthenticationService.generateAccessToken({
      id,
      email,
      phone,
      role,
    });
    const newRefreshToken =
      await this.jwtAuthenticationService.generateRefreshToken({
        id,
        email,
        phone,
        role,
      });
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
