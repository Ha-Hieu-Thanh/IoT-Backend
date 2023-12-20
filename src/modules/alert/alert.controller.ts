import { Controller, Get } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  async getAlerts() {
    // return await this.alertService.getAlerts();
  }
}
