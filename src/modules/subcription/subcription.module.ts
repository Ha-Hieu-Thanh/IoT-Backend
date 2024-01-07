import { Module } from '@nestjs/common';
import { SubcriptionService } from './subcription.service';
import { SubcriptionController } from './subcription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '@app/common/database/mysql/entities/Subscription';
import { Location } from '@app/common/database/mysql/entities/Location';
import { GlobalCacheModule } from '@app/common/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Location]),
    GlobalCacheModule,
  ],
  controllers: [SubcriptionController],
  providers: [SubcriptionService],
  exports: [SubcriptionService],
})
export class SubcriptionModule {}
