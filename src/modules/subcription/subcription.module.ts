import { Module } from '@nestjs/common';
import { SubcriptionService } from './subcription.service';
import { SubcriptionController } from './subcription.controller';

@Module({
  controllers: [SubcriptionController],
  providers: [SubcriptionService],
  exports: [SubcriptionService],
})
export class SubcriptionModule {}
