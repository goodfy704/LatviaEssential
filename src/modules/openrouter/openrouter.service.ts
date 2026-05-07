import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AppConfig } from '@config/configuration';

@Injectable()
export class OpenrouterService {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(configService: ConfigService<AppConfig>) {
    const apiKey = configService.get('openrouter', { infer: true })!.apiKey;
    this.model = configService.get('openrouter', { infer: true })!.model;

    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
  }

  getClient(): OpenAI {
    return this.client;
  }

  getModel(): string {
    return this.model;
  }
}
