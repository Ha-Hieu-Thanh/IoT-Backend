import Request from 'express';

export enum ERoleType {
  USER = 'user',
  ADMIN = 'admin',
}

export enum ETokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

export enum EStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum EIndexType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  NH3 = 'nh3',
  PM25 = 'pm25',
  CO = 'co',
  CO2 = 'co2',
}

export enum TypeCacheData {
  USER_INFO_BY_LOCATION = 'user_info_by_location',
}

export interface CustomRequest extends Request {
  payload: any;
}
