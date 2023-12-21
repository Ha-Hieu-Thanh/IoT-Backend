import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SubcriptionService } from './subcription.service';
import { User } from '@app/common/core/decorator/user.decorator';
import { UserPermission } from '@app/common/core/decorator/permission.decorator';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('subcription')
@Controller('subcription')
export class SubcriptionController {
  constructor(private readonly subcriptionService: SubcriptionService) {}

  @Get()
  @UserPermission()
  async getSubcriptions(@User('id') userId: number) {
    return await this.subcriptionService.getSubcriptions();
  }

  @Post('/:locationId')
  @UserPermission()
  async createSubcription(
    @User('id') userId: number,
    @Param('locationId', ParseIntPipe) locationId: number,
  ) {
    return await this.subcriptionService.createSubcription(userId, locationId);
  }

  @Delete('/:locationId')
  async unSubcription(
    @User('id') userId: number,
    @Param('locationId', ParseIntPipe) locationId: number,
  ) {
    return await this.subcriptionService.unSubcription(userId, locationId);
  }
}
