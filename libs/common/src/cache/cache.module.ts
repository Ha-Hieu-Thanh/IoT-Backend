import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { GlobalCacheService } from './cache.service';
import { IConfig } from '../config/configuration';

@Module({
  providers: [GlobalCacheService],
  exports: [GlobalCacheService],
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IConfig, true>) => {
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
  ],
})
export class GlobalCacheModule {}
