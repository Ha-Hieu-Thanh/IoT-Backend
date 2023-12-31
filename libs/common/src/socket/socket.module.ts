import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DataModule } from 'src/modules/data/data.module';
import { BullModule } from '@nestjs/bull';
import { GlobalCacheModule } from '../cache/cache.module';
import { AlertModule } from 'src/modules/alert/alert.module';
import { JwtAuthenticationModule } from '../jwt-authentication';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig, IJwtConfig } from '../config/configuration';

@Module({
  imports: [
    AlertModule,
    GlobalCacheModule,
    DataModule,
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
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
