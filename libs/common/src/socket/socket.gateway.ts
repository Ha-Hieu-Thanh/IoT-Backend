import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { DataService } from 'src/modules/data/data.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GlobalCacheService } from '../cache/cache.service';
import { AlertService } from 'src/modules/alert/alert.service';

@WebSocketGateway()
export class SocketGateway {
  constructor(
    private readonly socketService: SocketService,
    private readonly dataService: DataService,
    private readonly alertService: AlertService,
    @InjectQueue('SMSQueue') private readonly smsQueue: Queue,
    @InjectQueue('SESQueue') private readonly sesQueue: Queue,
    private readonly globalCacheService: GlobalCacheService,
  ) {}
  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected');
  }

  @OnEvent('0981957216')
  async create(@MessageBody() data: any) {
    console.log(data);

    // ADD TO QUEUE TO SAVE TO DB MONGODB
    await this.dataService.create(data);
    // LOGIC TO EMIT WARNING
    const warningData = data.temperature; // calculate AQI
    if (warningData > 30) {
      // emit to client
      this.server.emit('warning', warningData);

      // TODO: get user subcribe to 0981957216 by cache
      const userInfos = await this.globalCacheService.getUserInfoByLocation(1);
      const phones = userInfos.map((item) => item.phone);
      const emails = userInfos.map((item) => item.email);
      const subcriptionIds = userInfos.map((item) => item.subcriptionId);
      // queue NOTI and MAIL and SAVE TO DB warning to client who subcribe
      // this.smsQueue.add('SendOTP', {
      //   phone: '0399344239',
      //   body: 'Warning',
      // });
      phones.forEach((phone) => {
        this.smsQueue.add('SendOTP', {
          phone: phone,
          body: 'Warning' + warningData,
        });
      });

      // this.sesQueue.add('SendOTP', {
      //   to: 'hieuthanh4a2@gmail.com',
      //   subject: 'Warning',
      //   body: 'Warning',
      // });
      emails.forEach((email) => {
        this.sesQueue.add('SendOTP', {
          to: email,
          subject: 'Warning',
          body: 'Warning' + warningData,
        });
      });

      // save to alert by bulk add
      const alerts = subcriptionIds.map((item) => {
        return {
          subscriptionId: item,
          message: 'Warning' + warningData,
        };
      });
      await this.alertService.createAlerts(alerts);
    }

    // EMIT DATA TO CLIENT TO SHOW STREAMING
    this.server.emit('0981957216', data);
  }
}
