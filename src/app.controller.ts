import {
  Controller,
  Get,
  Inject,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SesService } from '@app/common/aws/ses/ses.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventEmitter: EventEmitter2,
    private readonly sesService: SesService,
  ) {}

  // @Get()
  // async getHello() {
  //   await this.sesService.sendMail();
  //   return 'send mail successfully';
  // }

  // subcribe to location 1
  @EventPattern('0981957216')
  async getData(data: string) {
    // console.log(data);
    await this.eventEmitter.emitAsync('0981957216', data);
  }

  // subcribe to location 2
  // @EventPattern('0981957216')
  // async getData(data: string) {
  //   // console.log(data);
  //   await this.eventEmitter.emitAsync('data', data);
  // }
}
