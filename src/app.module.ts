import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommonModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import configuration from '@app/common/config/configuration';
import { SesModule } from '@app/common/aws/ses/ses.module';
import { QueueModule } from '@app/common/queue/queue.module';
import { AppLoggerMiddleware } from '@app/common/core/middleware/appLogger.middleware';
import { AllExceptionsFilter } from '@app/common/core/filter/exception.filter';
import { LocationModule } from './modules/location/location.module';
import { AlertModule } from './modules/alert/alert.module';
import { SubcriptionModule } from './modules/subcription/subcription.module';
import { DataModule } from './modules/data/data.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CommonModule,
    AuthModule,
    SesModule,
    QueueModule,
    LocationModule,
    AlertModule,
    SubcriptionModule,
    DataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
