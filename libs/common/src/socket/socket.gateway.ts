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
import { Logger } from '@nestjs/common';
import { Exception } from '../core/exception';
import { ErrorCode } from '../helper/error';
import { JwtAuthenticationService } from '../jwt-authentication';
@WebSocketGateway({ namespace: 'socket-data' })
export class SocketGateway {
  constructor(
    private readonly socketService: SocketService,
    private readonly dataService: DataService,
    private readonly alertService: AlertService,
    @InjectQueue('SMSQueue') private readonly smsQueue: Queue,
    @InjectQueue('SESQueue') private readonly sesQueue: Queue,
    private readonly globalCacheService: GlobalCacheService,
    private readonly jwtAuthenticationService: JwtAuthenticationService,
  ) {}
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(SocketGateway.name);

  afterInit() {
    /**
     * User connect lên server gửi kèm header bên trong chứa authorization token.
     *  Vetify Token
     */
    this.server.use(async (client, next) => {
      try {
        const authorization =
          client.handshake.headers.authorization || client.handshake.auth.token;

        if (authorization) {
          const payload = await this.jwtAuthenticationService.verifyAccessToken(
            String(authorization),
          );

          if (!payload) {
            return next(
              Object.assign(
                new Exception(
                  ErrorCode.Verify_Token_Fail,
                  'Token khong hop le',
                ),
              ),
            );
          }

          Object.assign(client.data, { id: payload.id });
        }

        if (!authorization) {
          this.logger.error('Chua truyen vao token');
          return next(new Error('Chua truyen vao token'));
        }

        return next();
      } catch (error) {
        this.logger.error(error);
        return next(new Error(error.message));
      }
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(
      `Client connected: ${client.id}, userId: ${client.data.id}`,
    );
  }

  @OnEvent('0981957216')
  async create(@MessageBody() rawData: any) {
    const { topic, others: data } = rawData;
    console.log(data);

    await this.dataService.create(data);
    const dateNow = new Date().toISOString();
    const dateNowMinus5 = new Date(
      new Date().getTime() - 5 * 60 * 1000,
    ).toISOString();

    const query = {
      fromDate: dateNowMinus5,
      toDate: dateNow,
      locationId: data.locationId,
    };

    const dataInNearly5Min = await this.dataService.getAqi(query);
    console.log(dataInNearly5Min);
    if (dataInNearly5Min > 300) {
      this.server.emit('warning', dataInNearly5Min);

      const userInfos = await this.globalCacheService.getUserInfoByLocation(
        data.locationId,
      );
      const phones = userInfos.map((item) => item.phone);
      const emails = userInfos.map((item) => item.email);
      const subcriptionIds = userInfos.map((item) => item.subcriptionId);
      const isShouldAlert = await this.alertService.shouldAlert(subcriptionIds);
      if (isShouldAlert) {
        phones.forEach((phone) => {
          this.smsQueue.add('SendOTP', {
            phone: phone,
            body: 'Warning ' + dataInNearly5Min,
          });
        });

        emails.forEach((email) => {
          this.sesQueue.add('SendOTP', {
            to: email,
            subject: 'Warning',
            body: `
            Warning!
            The AQI currently is ${dataInNearly5Min} and it not good
            Please do not go to this location now!
            `,
          });
        });

        const alerts = subcriptionIds.map((item) => {
          return {
            subscriptionId: item,
            message: 'Warning ' + dataInNearly5Min,
          };
        });
        await this.alertService.createAlerts(alerts);
      }
    }

    this.server.emit(topic, data);
  }
}
