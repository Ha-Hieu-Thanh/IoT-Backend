import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ERoleType, EStatus } from '../../../helper/const';

@Entity('user')
export class User extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'phone', type: 'varchar', length: 255 })
  phone: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: ERoleType,
    default: ERoleType.USER,
  })
  role: ERoleType;

  @Column({ name: 'verify_code', type: 'varchar', length: 255, nullable: true })
  verifyCode: string;

  @Column({ name: 'forgot_code', type: 'varchar', length: 255, nullable: true })
  forgotCode: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EStatus,
    default: EStatus.INACTIVE,
  })
  status: EStatus;
}
