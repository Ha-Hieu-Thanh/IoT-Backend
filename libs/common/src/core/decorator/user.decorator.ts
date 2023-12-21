import { CustomRequest } from '@app/common/helper/const';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();
    switch (data) {
      case 'id':
        return request.payload['id'];
      default:
        return request.payload;
    }
  },
);
