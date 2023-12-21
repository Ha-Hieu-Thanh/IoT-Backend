import { Subscription } from '@app/common/database/mysql/entities/Subscription';
import { Location } from '@app/common/database/mysql/entities/Location';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Exception } from '@app/common/core/exception';
import { ErrorCode } from '@app/common/helper/error';

@Injectable()
export class SubcriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subcriptionRepository: Repository<Subscription>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async unSubcription(userId: number, locationId: number) {
    const subcription = await this.subcriptionRepository.findOne({
      where: { userId, locationId },
    });
    if (!subcription)
      throw new Exception(
        ErrorCode.USER_NOT_SUBCRIBE_TO_LOCATION,
        'User not subcribe to location',
      );
    await this.subcriptionRepository.delete({ userId, locationId });
    return { message: 'Unsubcribe success' };
  }
  async createSubcription(userId: number, locationId: number) {
    const subcription = await this.subcriptionRepository.findOne({
      where: { userId, locationId },
    });
    if (subcription)
      throw new Exception(
        ErrorCode.USER_ALREADY_SUBCRIBE_TO_LOCATION,
        'User already subcribe to location',
      );
    const newSubcription = await this.subcriptionRepository.save({
      userId,
      locationId,
    });
    return newSubcription;
  }
  async getSubcriptions(userId: number) {
    const subcriptions = await this.subcriptionRepository.find({
      where: { userId },
    });
    const locationIds = subcriptions.map((item) => item.locationId);
    const locations = await this.locationRepository.find({
      where: { id: In(locationIds) },
    });

    return locations;
  }
}
