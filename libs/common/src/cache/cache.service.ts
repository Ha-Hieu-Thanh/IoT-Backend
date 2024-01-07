import { Injectable, forwardRef } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TypeCacheData } from '../helper/const';
import { SubcriptionService } from 'src/modules/subcription/subcription.service';
import { LocationService } from 'src/modules/location/location.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GlobalCacheService {
  private readonly redis: Redis;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => LocationService))
    private readonly locationService: LocationService,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: configService.get('redis').host,
      port: configService.get('redis').port,
      db: configService.get('redis').db,
      password: configService.get('redis').password,
    });
  }

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
    return await this.redis.hset(key, fileName, data);
  }

  //get data thoe field
  async hashGet(key: string, fieldName: string) {
    return await this.redis.hget(key, fieldName);
  }

  // get all field-value of key
  async hashGetAll(key: string) {
    return await this.redis.hgetall(key);
  }

  // Update value of key by increment : value += increment
  async hincrby(key: string, fieldName: string, increment: number) {
    return await this.redis.hincrby(key, fieldName, increment);
  }

  //del one field in key
  async hdel(key: string, fieldName: string) {
    return await this.redis.hdel(key, fieldName);
  }

  /******************************************************************************************* */
  async getUserInfoByLocation(locationId: number) {
    const keyCache = this.createKeyCacheData(
      TypeCacheData.USER_INFO_BY_LOCATION,
      locationId,
    );

    // get cache
    const data = await this.hashGetAll(keyCache);
    if (data && Object.keys(data).length > 0) {
      // return Object.values(data);
      /**
       * [
  '{"subcriptionId":"1","id":"9","name":"Hieu Thanh","email":"thanh.hh204787@sis.hust.edu.vn","phone":"0399344239"}'
]
       */
      // transform to object
      return Object.values(data).map((item) => JSON.parse(item));
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

  async deleteLocationIdCache(locationId: number) {
    const keyCache = this.createKeyCacheData(
      TypeCacheData.USER_INFO_BY_LOCATION,
      locationId,
    );
    // valid before del
    const data = await this.hashGetAll(keyCache);
    if (!data || Object.keys(data).length === 0) return;
    // del
    await this.del(keyCache);
  }

  async deleteUserSubcribeToLocationCache(locationId: number, userId: number) {
    const keyCache = this.createKeyCacheData(
      TypeCacheData.USER_INFO_BY_LOCATION,
      locationId,
    );
    // valid keycache userId before del
    const data = await this.hashGet(keyCache, userId.toString());
    if (!data) return;
    // del
    await this.hdel(keyCache, userId.toString());
  }

  async createUserSubcribeToLocationCache(locationId: number, userId: number) {
    const keyCache = this.createKeyCacheData(
      TypeCacheData.USER_INFO_BY_LOCATION,
      locationId,
    );
    const userInfo = await this.locationService.getUserSubcribeToLocation(
      locationId,
    );
    const data = userInfo.find((item) => item.id === userId);
    await this.hashSet(keyCache, userId.toString(), JSON.stringify(data));
  }
}
