import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
