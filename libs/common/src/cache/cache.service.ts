import { Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TypeCacheData } from '../helper/const';
import { SubcriptionService } from 'src/modules/subcription/subcription.service';
import { LocationService } from 'src/modules/location/location.service';
import { userInfo } from 'os';

@Injectable()
export class GlobalCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly locationService: LocationService,
  ) {}

  /********************************************************************************** */
  async reset() {
    const keys = [TypeCacheData.USER_INFO_BY_LOCATION];
    const arrayPatten: string[] = [];

    await Promise.all(
      keys.map(async (item) => {
        const index = `${this.createKeyCacheData(item)}*`;
        const data = await (this.cacheManager as any).keys(index);
        arrayPatten.push(...data);
      }),
    );

    await (this.cacheManager as any).del(arrayPatten);
  }

  createKeyCacheData(type: TypeCacheData, keyword?: any) {
    if (keyword) return `key_cache:${type}:${keyword}`;
    return `key_cache:${type}`;
  }

  async set(keyCache: string, data: any, ttl?: number) {
    return await this.cacheManager.set(keyCache, data, ttl);
  }

  async get(keyCache: string) {
    return await this.cacheManager.get(keyCache);
  }

  async mget(keyCache: string[]) {
    return await (this.cacheManager as any).mget(...keyCache);
  }

  async mset(data: any[]) {
    return await (this.cacheManager as any).mset(...data);
  }

  async del(keyCache: string) {
    return await this.cacheManager.del(keyCache);
  }

  async hashSet(key: string, fileName: string, data: any) {
    return await (this.cacheManager as any).hset(key, fileName, data);
  }

  //get data thoe field
  async hashGet(key: string, fieldName: string) {
    return await (this.cacheManager as any).hget(key, fieldName);
  }

  // get all field-value of key
  async hashGetAll(key: string) {
    return await (this.cacheManager as any).hgetall(key);
  }

  // Update value of key by increment : value += increment
  async hincrby(key: string, fieldName: string, increment: number) {
    return await (this.cacheManager as any).hincrby(key, fieldName, increment);
  }

  //del one field in key
  async hdel(key: string, fieldName: string) {
    return await (this.cacheManager as any).hdel(key, fieldName);
  }

  /******************************************************************************************* */
  async getUserInfoByLocation(locationId: number) {
    const keyCache = this.createKeyCacheData(
      TypeCacheData.USER_INFO_BY_LOCATION,
      locationId,
    );

    // get cache
    const data = await this.hashGetAll(keyCache);
    if (data) {
      return Object.values(data);
    }

    // query and set user info and get user info
    const userInfos = (await this.locationService.getUserSubcribeToLocation(
      locationId,
    )) as any[];
    // set cache
    userInfos.forEach((userInfo) => {
      this.hashSet(keyCache, userInfo.id, JSON.stringify(userInfo));
    });

    return userInfos;
  }
}
