import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
@WebSocketGateway()
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}
  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected');
  }

  @OnEvent('0981957216')
  create(@MessageBody() data: any) {
    console.log(data);

    // ADD TO QUEUE TO SAVE TO DB MONGODB

    // LOGIC TO EMIT WARNING
    const warningData = data.temperature; // calculate AQI
    if (warningData > 30) {
      // emit to client
      this.server.emit('warning', warningData);

      // queue NOTI and MAIL and SAVE TO DB warning to client who subcribe
    }

    // EMIT DATA TO CLIENT TO SHOW STREAMING
    this.server.emit('0981957216', data);
  }
}
