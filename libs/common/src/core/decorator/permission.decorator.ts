import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { ERoleType } from '@app/common/helper/const';
import { RolesGuard } from '../guard/roles.guard';

export const UserPermission = () => applyDecorators(ApiBearerAuth());

export const AdminPermission = () =>
  applyDecorators(
    ApiBearerAuth(),
    Roles(ERoleType.ADMIN),
    UseGuards(RolesGuard),
  );
