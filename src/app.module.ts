import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import configuration, { configValidationSchema } from './config/configuration';
import { DatabaseModule } from '@modules/database/database.module';
import { QueueModule } from '@modules/queue/queue.module';
import { ListingsModule } from '@modules/listings/listings.module';
import { ScraperModule } from '@modules/scraper/scraper.module';
import { DiscordModule } from '@modules/discord/discord.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { OpenrouterModule } from '@modules/openrouter/openrouter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
        },
      }),
    }),
    DatabaseModule,
    QueueModule,
    ListingsModule,
    ScraperModule,
    DiscordModule,
    NotificationsModule,
    OpenrouterModule,
  ],
})
export class AppModule {}
