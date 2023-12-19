import { Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class GlobalCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}