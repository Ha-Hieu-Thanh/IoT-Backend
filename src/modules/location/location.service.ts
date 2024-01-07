import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '@app/common/database/mysql/entities/Location';
import { In, Repository } from 'typeorm';
import { Exception } from '@app/common/core/exception';
import { ErrorCode } from '@app/common/helper/error';
import { Subscription } from '@app/common/database/mysql/entities/Subscription';
import { User } from '@app/common/database/mysql/entities/User';
import { EStatus } from '@app/common/helper/const';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GlobalCacheService } from '@app/common/cache/cache.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
    private readonly globalCacheService: GlobalCacheService,
  ) {}

  async getUserLocations(id: number) {
    const subcriptions = await this.subscriptionRepository.find({
      where: { userId: id },
    });
    const locationIds = subcriptions.map((item) => item.locationId);
    const locations = await this.locationRepository.find();
    const result = locations.map((location) => {
      const isSubscribed = locationIds.includes(location.id);
      return {
        ...location,
        isSubscribed,
      };
    });
    return result;
  }

  async getUserSubcribeToLocation(id: number) {
    const location = await this.locationRepository.findOne({
      where: { id },
    });
    if (!location)
      throw new Exception(ErrorCode.LocationNotFound, 'Location not found');
    const subcriptions = await this.subscriptionRepository.find({
      where: { locationId: id },
    });
    const userIds = subcriptions.map((item) => item.userId);
    const users = await this.userRepository.find({
      where: { id: In(userIds), status: EStatus.ACTIVE },
      select: ['id', 'name', 'email', 'phone'],
    });
    console.log(users);
    // relation user with subcription
    const result = subcriptions.map((item) => {
      const user = users.find((user) => user.id === item.userId);
      return {
        subcriptionId: item.id,
        ...user,
      };
    });
    return result;
  }

  async deleteLocation(id: number) {
    const location = await this.locationRepository.findOne({
      where: { id },
    });

    if (!location)
      throw new Exception(ErrorCode.LocationNotFound, 'Location not found');
    const locationName = location.name;
    await this.locationRepository.delete({ id });
    this.eventEmitter.emitAsync('delete-location', locationName);
    this.globalCacheService.deleteLocationIdCache(id);
    return { message: 'Delete location success' };
  }

  async updateLocation(id: number, body: UpdateLocationDto) {
    const location = await this.locationRepository.findOne({
      where: { id },
    });
    if (!location)
      throw new Exception(ErrorCode.LocationNotFound, 'Location not found');
    const preLocationName = location.name;
    await this.locationRepository.update({ id }, body);
    const newLocation = await this.locationRepository.findOne({
      where: { id },
    });
    const newLocationName = newLocation.name;

    if (preLocationName !== newLocationName)
      await this.eventEmitter.emitAsync('update-location', {
        preLocationName,
        newLocationName,
      });
    return newLocation;
  }

  async createLocation(body: CreateLocationDto) {
    const location = await this.locationRepository.save(body);
    await this.eventEmitter.emitAsync('create-location', location.name);
    return location;
  }

  async getLocations() {
    return await this.locationRepository.find();
  }
}
