import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CvLvScraper } from '@modules/scraper/cv-lv.scraper';
import { ListingsService } from '@modules/listings/listings.service';
import { QueueService } from './queue.service';

@Processor('scrape')
export class ScrapeWorker extends WorkerHost {
  constructor(
    private readonly cvLvScraper: CvLvScraper,
    private readonly listingsService: ListingsService,
    private readonly queueService: QueueService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { source, url, category } = job.data;

    const scraped = await this.cvLvScraper.scrape(url, category);
    const newListings = await this.listingsService.saveNew(scraped);

    for (const listing of newListings) {
      await this.queueService.addNotificationJob({
        listingUrl: listing.url,
        channel: 'discord',
      });
    }
  }
}
