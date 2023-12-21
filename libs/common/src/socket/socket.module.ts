import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DataModule } from 'src/modules/data/data.module';
import { BullModule } from '@nestjs/bull';
import { GlobalCacheModule } from '../cache/cache.module';

@Module({
  imports: [
    GlobalCacheModule,
    DataModule,
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
