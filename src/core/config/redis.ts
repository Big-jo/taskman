import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

const schema = Joi.object<RedisConfig>({
  host: Joi.string().required(),
  port: Joi.number().integer().min(0).required(),
  password: Joi.string().optional(),
  db: Joi.number().integer().min(0).required(),
});

export const getConfig = (): RedisConfig => {
  const config = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  };

  return config;
};

export default registerAs('redis', (): RedisConfig => {
  const config = getConfig();
  Joi.assert(config, schema, 'Redis config validation failed');
  return config;
});

