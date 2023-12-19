import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '@app/common/database/mysql/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthenticationModule } from '@app/common/jwt-authentication';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig, IJwtConfig } from '@app/common/config/configuration';
import { QueueModule } from '@app/common/queue/queue.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtAuthenticationModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IJwtConfig>('jwt'),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'SMSQueue',
    }),
    BullModule.registerQueue({
      name: 'SESQueue',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
