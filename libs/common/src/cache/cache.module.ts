import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { GlobalCacheService } from './cache.service';
import { IConfig } from '../config/configuration';
import { SubcriptionModule } from 'src/modules/subcription/subcription.module';
import { LocationModule } from 'src/modules/location/location.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  providers: [GlobalCacheService],
  exports: [GlobalCacheService],
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IConfig, true>) => {
        console.log(configService.get('redis'));
        return {
          store: redisStore as any,
          host: configService.get('redis').host,
          port: configService.get('redis').port,
          db: configService.get('redis').db,
          password: configService.get('redis').password,
          ttl: configService.get('redis').ttl,
        };
      },
      inject: [ConfigService],
    }),
    LocationModule,
  ],
})
export class GlobalCacheModule {}
