import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/common/database/mysql/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
