import { Controller, Get } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  // filters by date or chất
  @Get()
  async getData() {
    // return await this.dataService.getData();
  }
}
