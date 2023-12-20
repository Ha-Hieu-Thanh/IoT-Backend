import { Controller, Delete, Get, Post } from '@nestjs/common';
import { SubcriptionService } from './subcription.service';

@Controller('subcription')
export class SubcriptionController {
  constructor(private readonly subcriptionService: SubcriptionService) {}

  @Get()
  async getSubcriptions(userId: number) {
    // return await this.subcriptionService.getSubcriptions();
  }

  @Post()
  async createSubcription(userId: number, locationId: number) {
    // return await this.subcriptionService.createSubcription();
  }

  @Delete()
  async unSubcription(userId: number, locationId: number) {
    // return await this.subcriptionService.deleteSubcription();
  }
}
