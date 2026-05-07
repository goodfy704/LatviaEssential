import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma.service';
import { ScrapedListing } from '@modules/scraper/dto/scraped-listing.dto';
import * as crypto from 'crypto';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async saveNew(listings: ScrapedListing[]): Promise<ScrapedListing[]> {
    const saved: ScrapedListing[] = [];

    for (const listing of listings) {
      const result = await this.saveOne(listing);
      if (result.isNew) {
        saved.push(listing);
      }
    }

    return saved;
  }

  private async saveOne(
    listing: ScrapedListing,
  ): Promise<{ isNew: boolean }> {
    const fingerprint = this.makeFingerprint(listing);

    const existing = await this.prisma.listing.findUnique({
      where: { fingerprint },
    });

    if (existing) {
      return { isNew: false };
    }

    await this.prisma.listing.create({
      data: {
        title: listing.title,
        company: listing.company,
        location: listing.location,
        url: listing.url,
        source: listing.source,
        category: listing.category,
        fingerprint,
      },
    });

    return { isNew: true };
  }

  private makeFingerprint(listing: ScrapedListing): string {
    const raw = `${listing.title}|${listing.company ?? ''}|${listing.url}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }
}
