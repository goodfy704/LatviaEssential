export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
