import { Controller, Get } from '@nestjs/common';
import { MemberService } from './member.service';
import { ApiTags } from '@nestjs/swagger';
import { UserPermission } from '@app/common/core/decorator/permission.decorator';
import { User } from '@app/common/core/decorator/user.decorator';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/profile')
  @UserPermission()
  async getMember(@User('id') userId: number) {
    return await this.memberService.getMember(userId);
  }
}
