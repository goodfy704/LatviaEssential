import * as Joi from 'joi';

export interface AppConfig {
  nodeEnv: string;
  port: number;
  database: {
    url: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  discord: {
    botToken: string;
    clientId: string;
    guildId: string;
  };
  openrouter: {
    apiKey: string;
    model: string;
  };
  scraper: {
    userAgent: string;
    requestDelayMs: number;
    maxConcurrent: number;
  };
}

export default function configuration(): AppConfig {
  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT) || 3000,
    database: {
      url: process.env.DATABASE_URL ?? '',
    },
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    },
    discord: {
      botToken: process.env.DISCORD_BOT_TOKEN ?? '',
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      guildId: process.env.DISCORD_GUILD_ID ?? '',
    },
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY ?? '',
      model: process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini',
    },
    scraper: {
      userAgent:
        process.env.SCRAPER_USER_AGENT ??
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      requestDelayMs: Number(process.env.SCRAPER_REQUEST_DELAY_MS) || 2000,
      maxConcurrent: Number(process.env.SCRAPER_MAX_CONCURRENT) || 2,
    },
  };
}

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  DISCORD_BOT_TOKEN: Joi.string().optional().allow(''),
  DISCORD_CLIENT_ID: Joi.string().optional().allow(''),
  DISCORD_GUILD_ID: Joi.string().optional().allow(''),
  OPENROUTER_API_KEY: Joi.string().optional().allow(''),
  OPENROUTER_MODEL: Joi.string().default('openai/gpt-4o-mini'),
  SCRAPER_USER_AGENT: Joi.string().optional(),
  SCRAPER_REQUEST_DELAY_MS: Joi.number().default(2000),
  SCRAPER_MAX_CONCURRENT: Joi.number().default(2),
});
