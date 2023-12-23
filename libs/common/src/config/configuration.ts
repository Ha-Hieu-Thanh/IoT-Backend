import * as Joi from 'joi';
require('dotenv').config();
const configSchema = Joi.object({
  port: Joi.number().integer().min(1).max(65535).required(),
  database: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().integer().min(1).max(65535).required(),
    db_name: Joi.string().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
  aws: Joi.object({
    accessKeyId: Joi.string().required(),
    secretAccessKey: Joi.string().required(),
    region: Joi.string().required(),
    sender: Joi.string().required(),
  }).required(),
  redis: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().integer().min(1).max(65535).required(),
    password: Joi.optional(),
    ttl: Joi.number().integer().min(1).required(),
  }).required(),
  mqtt: Joi.object({
    host: Joi.optional(),
    port: Joi.optional(),
    username: Joi.optional(),
    password: Joi.optional(),
  }).optional(),
  twilio: Joi.object({
    id: Joi.string().required(),
    token: Joi.string().required(),
    phone: Joi.string().required(),
  }).required(),
  jwt: Joi.object({
    secretOrKey: Joi.string().required(),
    accessTokenExpiredIn: Joi.string().required(),
    refreshTokenExpiredIn: Joi.string().required(),
  }).required(),
  nodemailer: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().integer().min(1).max(65535).required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    from: Joi.string().required(),
  }).required(),
  mongo: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    cluster: Joi.string().required(),
    database: Joi.string().required(),
  }).required(),
  cloudinary: Joi.object({
    cloud_name: Joi.string().required(),
    api_key: Joi.string().required(),
    api_secret: Joi.string().required(),
  }).required(),
});

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    db_name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    sender: process.env.AWS_SENDER,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    ttl: parseInt(process.env.REDIS_TTL, 10) || 600,
  },
  mqtt: {
    host: process.env.MQTT_HOST,
    port: parseInt(process.env.MQTT_PORT, 10) || 1883,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  },
  twilio: {
    id: process.env.TWILIO_ID,
    token: process.env.TWILIO_TOKEN,
    phone: process.env.TWILIO_PHONE,
  },
  jwt: {
    secretOrKey: process.env.JWT_SECRET_KEY,
    accessTokenExpiredIn: process.env.JWT_ACCESS_TOKEN_EXPIRED_IN,
    refreshTokenExpiredIn: process.env.JWT_REFRESH_TOKEN_EXPIRED_IN,
  },
  nodemailer: {
    host: process.env.NODEMAILER_HOST,
    port: parseInt(process.env.NODEMAILER_PORT, 10) || 587,
    user: process.env.NODEMAILER_USER,
    password: process.env.NODEMAILER_PASSWORD,
    from: process.env.NODEMAILER_FROM,
  },
  mongo: {
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    cluster: process.env.MONGODB_CLUSTER,
    database: process.env.MONGODB_DATABASE,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};

export interface IDatabaseConfig {
  host: string;
  port: number;
  db_name: string;
  user: string;
  password: string;
}

export interface IAWSConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sender: string;
}

export interface IRedisConfig {
  host: string;
  port: number;
  password?: string;
  ttl: number;
}

export interface IMQTTConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface ITwilioConfig {
  id: string;
  token: string;
  phone: string;
}

export interface IJwtConfig {
  secretOrKey: string;
  accessTokenExpiredIn: string;
  refreshTokenExpiredIn: string;
}

export interface INodemailerConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface IMongoConfig {
  username: string;
  password: string;
  cluster: string;
  database: string;
}

export interface ICloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export interface IConfig {
  port: number;
  database: IDatabaseConfig;
  aws: IAWSConfig;
  redis: IRedisConfig;
  mqtt: IMQTTConfig;
  twilio: ITwilioConfig;
  jwt: IJwtConfig;
  nodemailer: INodemailerConfig;
  mongo: IMongoConfig;
  cloudinary: ICloudinaryConfig;
}

const { error, value } = configSchema.validate(config);

if (error) {
  throw new Error(`Invalid configuration: ${error.message}`);
}

export default () => value;
