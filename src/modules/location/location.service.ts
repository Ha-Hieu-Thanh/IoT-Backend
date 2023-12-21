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

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getUserSubcribeToLocation(id: number) {
    const location = await this.locationRepository.findOne({
      where: { id },
    });
    if (!location)
      throw new Exception(ErrorCode.LocationNotFound, 'Location not found');
    const subscriptions = await this.subscriptionRepository.find({
      where: { locationId: id },
    });
    const userIds = subscriptions.map((item) => item.userId);
    const users = await this.userRepository.find({
      where: { id: In(userIds), status: EStatus.ACTIVE },
      select: ['id', 'name', 'email', 'phone'],
    });
    return users;
  }

  async deleteLocation(id: number) {
    const location = await this.locationRepository.findOne({
      where: { id },
    });
    if (!location)
      throw new Exception(ErrorCode.LocationNotFound, 'Location not found');
    await this.locationRepository.delete({ id });
    return { message: 'Delete location success' };
  }

  async updateLocation(id: number, body: UpdateLocationDto) {
    const location = await this.locationRepository.findOne({
      where: { id },
    });
    if (!location)
      throw new Exception(ErrorCode.LocationNotFound, 'Location not found');
    await this.locationRepository.update({ id }, body);
    return await this.locationRepository.findOne({ where: { id } });
  }

  async createLocation(body: CreateLocationDto) {
    const location = await this.locationRepository.save(body);
    return location;
  }

  async getLocations() {
    return await this.locationRepository.find();
  }
}
