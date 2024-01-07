import { Module, forwardRef } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '@app/common/database/mysql/entities/Location';
import { Subscription } from '@app/common/database/mysql/entities/Subscription';
import { User } from '@app/common/database/mysql/entities/User';
import { GlobalCacheModule } from '@app/common/cache/cache.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Subscription, User]),
    forwardRef(() => GlobalCacheModule),
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
