import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from '@app/common/database/mysql/entities/Alert';
import { Subscription } from '@app/common/database/mysql/entities/Subscription';

@Module({
  imports: [TypeOrmModule.forFeature([Alert, Subscription])],
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}
