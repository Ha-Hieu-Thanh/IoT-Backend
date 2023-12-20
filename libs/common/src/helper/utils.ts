import { LiteralObject } from '@nestjs/common';

export function getUTCTimeNow(): number {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const utcTime = new Date(now.getTime() - offset * 60 * 1000);
  return utcTime.getTime();
}

export function makePagingResponse(
  data: LiteralObject[],
  totalItems: number,
  query: LiteralObject,
  metadata: LiteralObject = {},
) {
  const totalPages = Math.ceil(totalItems / query.pageSize);
  return {
    paging: true,
    hasMore: query.pageIndex < totalPages,
    pageIndex: query.pageIndex,
    totalPages,
    totalItems,
    data,
    ...metadata,
  };
}
