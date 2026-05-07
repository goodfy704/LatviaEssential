import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '@modules/database/prisma.service';
import { DiscordService } from '@modules/discord/discord.service';

@Processor('notification')
export class NotificationWorker extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly discord: DiscordService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { listingUrl, channel } = job.data;
    if (channel !== 'discord') return;

    const listing = await this.prisma.listing.findUnique({
      where: { url: listingUrl },
    });
    if (!listing) return;

    await this.discord.sendJobNotification({
      title: listing.title,
      company: listing.company,
      location: listing.location,
      url: listing.url,
    });
  }
}
