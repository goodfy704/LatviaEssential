import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScraperModule } from '@modules/scraper/scraper.module';
import { ListingsModule } from '@modules/listings/listings.module';
import { QueueService } from './queue.service';
import { ScrapeWorker } from './scrape.worker';
import { NotificationWorker } from './notification.worker';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'scrape' }, { name: 'notification' }),
    ScraperModule,
    ListingsModule,
  ],
  providers: [QueueService, ScrapeWorker, NotificationWorker],
  exports: [QueueService],
})
export class QueueModule {}
