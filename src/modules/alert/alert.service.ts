import { Injectable } from '@nestjs/common';
import { GetAlertQueryDto } from './dto/get-alert-query.dto';

@Injectable()
export class AlertService {
  getAlerts(query: GetAlertQueryDto) {
    throw new Error('Method not implemented.');
  }
}
