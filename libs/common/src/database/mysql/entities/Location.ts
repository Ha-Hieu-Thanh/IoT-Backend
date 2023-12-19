import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('location')
export class Location extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'lat', type: 'varchar', length: 255 })
  lat: string;

  @Column({ name: 'long', type: 'varchar', length: 255 })
  long: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;
}
