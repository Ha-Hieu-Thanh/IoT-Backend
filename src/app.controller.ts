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
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SesService } from '@app/common/aws/ses/ses.service';
import { Public } from '@app/common/jwt-authentication/jwt-authentication.decorator';
import { CloudinaryService } from '@app/common/cloudinary/cloudinary.service';
import { LocationService } from './modules/location/location.service';

@Controller()
export class AppController implements OnModuleInit {
  private validTopics: string[] = [];
  constructor(
    private readonly appService: AppService,
    private readonly eventEmitter: EventEmitter2,
    private readonly sesService: SesService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly locationService: LocationService,
  ) {}

  async onModuleInit() {
    this.validTopics = (await this.locationService.getLocations()).map(
      (location) => location.name,
    );
    console.log(this.validTopics);
  }

  @OnEvent('delete-location')
  async handleDeleteLocation(data: any) {
    console.log(data);
    this.validTopics.filter((validTopic) => validTopic !== data);
  }

  @OnEvent('create-location')
  async handleCreateLocation(data: any) {
    console.log(data);
    this.validTopics.push(data);
  }

  @OnEvent('update-location')
  async handleUpdateLocation(data: any) {
    console.log(data);
    this.validTopics = this.validTopics.map((validTopic) =>
      validTopic === data.preLocationName ? data.newLocationName : validTopic,
    );
  }

  // @Get()
  // async getHello() {
  //   await this.sesService.sendMail();
  //   return 'send mail successfully';
  // }

  // subcribe to location 1
  @EventPattern('0981957216')
  async handleEvent(data: string) {
    console.log(data);
    try {
      // get topic and others field
      const { topic, ...others } = data as any;
      // check topic is valid
      if (this.validTopics.includes(topic)) {
        // emit event to topic
        console.log(topic, others);
        await this.eventEmitter.emitAsync('0981957216', { topic, others });
      }
    } catch (err) {
      console.log(err);
    }
  }

  // subcribe to location 2
  // @EventPattern('0981957216')
  // async getData(data: string) {
  //   await this.eventEmitter.emitAsync('data', data);
  // }
  @Public()
  @Get('test-cloudinary')
  async testCloudinary() {
    const dataFile = `
name,age,addr,
nam,12,ha noi,
    `;
    const data = await this.cloudinaryService.uploadFile(dataFile, 'test.csv');
    return data;
  }
}
