import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '@app/common/database/mysql/entities/Location';
import { Subscription } from '@app/common/database/mysql/entities/Subscription';
import { User } from '@app/common/database/mysql/entities/User';
@Module({
  imports: [TypeOrmModule.forFeature([Location, Subscription, User])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
