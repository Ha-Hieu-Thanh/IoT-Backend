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
import { Public } from '@app/common/jwt-authentication/jwt-authentication.decorator';
import {
  AdminPermission,
  UserPermission,
} from '@app/common/core/decorator/permission.decorator';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@app/common/core/decorator/user.decorator';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  @Get()
  @Public()
  async getLocations() {
    return await this.locationService.getLocations();
  }

  @Get('/user')
  @UserPermission()
  async getUserLocations(@User('id') id: number) {
    return await this.locationService.getUserLocations(id);
  }

  @Post()
  @AdminPermission()
  async createLocation(@Body() body: CreateLocationDto) {
    return await this.locationService.createLocation(body);
  }

  @Put('/:id')
  @AdminPermission()
  async updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateLocationDto,
  ) {
    return await this.locationService.updateLocation(id, body);
  }

  @Delete('/:id')
  @AdminPermission()
  async deleteLocation(@Param('id', ParseIntPipe) id: number) {
    return await this.locationService.deleteLocation(id);
  }

  @Get('/:id')
  @AdminPermission()
  async getUserSubcribeToLocation(@Param('id', ParseIntPipe) id: number) {
    return await this.locationService.getUserSubcribeToLocation(id);
  }
}
