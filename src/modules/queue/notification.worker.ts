import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notification')
export class NotificationWorker extends WorkerHost {
  async process(job: Job): Promise<void> {
    const { listingId, channel } = job.data;

    console.info(`Sending notification for listing ${listingId} to ${channel}`);

    // TODO: Implement notification logic
    // 1. Load listing from DB
    // 2. Format message
    // 3. Send via Discord
  }
}
