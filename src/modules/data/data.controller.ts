import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from './data.service';
import { GetDataDto } from './dto/get-data.dto';
import { UserPermission } from '@app/common/core/decorator/permission.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('data')
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  // filters by date or chất
  @UserPermission()
  @Get()
  async getData(@Query() query: GetDataDto) {
    return await this.dataService.getData(query);
  }

  @UserPermission()
  @Get('/aqi')
  async getAqi() {
    return await this.dataService.getAqiHistoryInNearly5HoursAndSeparateEachHour();
  }
}
