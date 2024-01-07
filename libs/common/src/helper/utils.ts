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

export function calculateAvgAQI(dataArray: any[]) {
  const avgCO =
    dataArray.reduce((acc, cur) => acc + cur.CO_concentration, 0) /
    dataArray.length;
  const avgCO2 =
    dataArray.reduce((acc, cur) => acc + cur.CO2_concentration, 0) /
    dataArray.length;
  const avgPM25 =
    dataArray.reduce((acc, cur) => acc + cur.PM25_concentration, 0) /
    dataArray.length;
  console.log({ avgCO, avgPM25, avgCO2 });
  const aqi = Math.max(
    calculateAQIByCO(avgCO),
    calculateAQIByCO2(avgCO2),
    calculateAQIByPM25(avgPM25),
  );
  console.log('aqi', aqi);
  return aqi;
}

export function calculateAQIByCO(co: number) {
  if (co <= 4.4) return 0;
  if (co <= 9.4) return linear(0, 4.4, 50, 100, co);
  if (co <= 12.4) return linear(4.5, 9.4, 101, 150, co);
  if (co <= 15.4) return linear(9.5, 12.4, 151, 200, co);
  if (co <= 30.4) return linear(12.5, 15.4, 201, 300, co);
  if (co <= 40.4) return linear(15.5, 30.4, 301, 400, co);
  if (co <= 50.4) return linear(30.5, 40.4, 401, 500, co);
  else return linear(40.5, 50.4, 501, 1000, co);
}

export function calculateAQIByCO2(co2: number) {
  if (co2 <= 50) return 0;
  if (co2 <= 100) return linear(51, 100, 50, 100, co2);
  if (co2 <= 150) return linear(101, 150, 101, 150, co2);
  if (co2 <= 200) return linear(151, 200, 151, 200, co2);
  if (co2 <= 300) return linear(201, 300, 201, 300, co2);
  if (co2 <= 400) return linear(301, 400, 301, 400, co2);
  if (co2 <= 500) return linear(401, 500, 401, 500, co2);
  else return linear(501, 1000, 501, 1000, co2);
}

export function calculateAQIByPM25(pm25: number) {
  if (pm25 <= 12) return linear(0, 12, 0, 50, pm25);
  if (pm25 <= 35.4) return linear(12.1, 35.4, 51, 100, pm25);
  if (pm25 <= 55.4) return linear(35.5, 55.4, 101, 150, pm25);
  if (pm25 <= 150.4) return linear(55.5, 150.4, 151, 200, pm25);
  if (pm25 <= 250.4) return linear(150.5, 250.4, 201, 300, pm25);
  if (pm25 <= 350.4) return linear(250.5, 350.4, 301, 400, pm25);
  if (pm25 <= 500.4) return linear(350.5, 500.4, 401, 500, pm25);
  else return linear(500.5, 1000.4, 501, 1000, pm25);
}

export function linear(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  x: number,
) {
  return ((y2 - y1) / (x2 - x1)) * (x - x1) + y1;
}
