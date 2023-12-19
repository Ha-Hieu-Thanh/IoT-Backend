import { Module } from '@nestjs/common';
import { SocketModule } from './socket/socket.module';
import { DatabaseModule } from './database';

@Module({
  providers: [],
  exports: [],
  imports: [SocketModule, ...DatabaseModule],
})
export class CommonModule {}
