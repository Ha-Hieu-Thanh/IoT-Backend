import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  @Get()
  getLocations() {
    // return await this.locationService.getLocation();
  }

  @Post()
  async createLocation(@Body() body: CreateLocationDto) {
    // return await this.locationService.createLocation();
  }

  @Put('/:id')
  async updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateLocationDto,
  ) {
    // return await this.locationService.updateLocation();
  }

  @Delete('/:id')
  async deleteLocation(@Param('id', ParseIntPipe) id: number) {
    // return await this.locationService.deleteLocation();
  }
}
