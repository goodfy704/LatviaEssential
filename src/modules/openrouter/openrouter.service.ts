import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AppConfig } from '@config/configuration';
import { OpenRouterMessage, OpenRouterCompletionOptions } from './interfaces';

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

  async complete(
    messages: OpenRouterMessage[],
    options?: OpenRouterCompletionOptions,
  ): Promise<string | null> {
    const response = await this.client.chat.completions.create({
      model: options?.model ?? this.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    });

    return response.choices[0]?.message?.content ?? null;
  }
}
