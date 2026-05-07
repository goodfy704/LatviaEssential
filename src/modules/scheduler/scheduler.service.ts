import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueService } from '@modules/queue/queue.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly queueService: QueueService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async scrapeCvLv(): Promise<void> {
    await this.queueService.addScrapeJob({
      source: 'cv.lv',
      url: 'https://cv.lv/lv/search?...developer',
      category: 'developer',
    });
  }
}
