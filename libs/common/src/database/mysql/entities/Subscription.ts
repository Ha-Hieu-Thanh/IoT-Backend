import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('subscription')
export class Subscription extends BaseEntity {
  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ name: 'location_id', type: 'bigint', unsigned: true })
  locationId: number;
}
