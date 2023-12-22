import { Injectable } from '@nestjs/common';
import { GetAlertQueryDto } from './dto/get-alert-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from '@app/common/database/mysql/entities/Alert';
import { In, Repository } from 'typeorm';
import { makePagingResponse } from '@app/common/helper/utils';
import { Subscription } from '@app/common/database/mysql/entities/Subscription';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}
  async createAlert(body: CreateAlertDto) {
    const { subscriptionId, message } = body;
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });
    if (!subscription) throw new Error('Subscription not found');
    const alert = await this.alertRepository.save({
      subscriptionId,
      message,
    });
    return alert;
  }

  async createAlerts(body: CreateAlertDto[]) {
    const alerts = await this.alertRepository.save(body);
    return alerts;
  }
  async getAlerts(query: GetAlertQueryDto) {
    let { pageSize, pageIndex } = query;
    if (!pageSize) pageSize = 10;
    if (!pageIndex) pageIndex = 1;
    const skip = (pageIndex - 1) * pageSize;
    const queryBuilder = this.alertRepository.createQueryBuilder('alert');
    if (query.fromDate) {
      queryBuilder.andWhere('alert.createdAt >= :fromDate', {
        fromDate: query.fromDate,
      });
    }
    if (query.toDate) {
      queryBuilder.andWhere('alert.createdAt <= :toDate', {
        toDate: query.toDate,
      });
    }

    const queryBuilder2 =
      this.subscriptionRepository.createQueryBuilder('subscription');
    if (query.locationIds && query.locationIds.length > 0) {
      queryBuilder2.andWhere('subscription.locationId IN (:...locationIds)', {
        locationIds: query.locationIds,
      });
    }

    if (query.userIds && query.userIds.length > 0) {
      queryBuilder2.andWhere('subscription.userId IN (:...userIds)', {
        userIds: query.userIds,
      });
    }

    const subscriptions = await queryBuilder2.getMany();
    const subcriptionIds = subscriptions.map((item) => item.id);

    if (subcriptionIds && subcriptionIds.length > 0) {
      queryBuilder.andWhere('alert.subscriptionId IN (:...subcriptionIds)', {
        subcriptionIds,
      });
    }

    const [alerts, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .orderBy('alert.createdAt', 'DESC')
      .getManyAndCount();
    return makePagingResponse(alerts, total, query);
  }
}
