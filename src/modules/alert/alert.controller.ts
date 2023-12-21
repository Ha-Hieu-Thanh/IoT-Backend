import { Controller, Get, Query } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AdminPermission } from '@app/common/core/decorator/permission.decorator';
import { GetAlertQueryDto } from './dto/get-alert-query.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('alert')
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @AdminPermission()
  async getAlerts(@Query() query: GetAlertQueryDto) {
    return await this.alertService.getAlerts(query);
  }
}
