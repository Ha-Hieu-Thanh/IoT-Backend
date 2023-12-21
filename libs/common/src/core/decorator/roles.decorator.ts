import { ERoleType } from '@app/common/helper/const';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: ERoleType[]) => SetMetadata('ROLES', roles);
