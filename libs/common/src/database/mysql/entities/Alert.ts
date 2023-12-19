import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('alert')
export class Alert extends BaseEntity {
  @Column({ name: 'subscription_id', type: 'bigint', unsigned: true })
  subscriptionId: number;

  @Column({ name: 'message', type: 'varchar', length: 255 })
  message: string;
}
