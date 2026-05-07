import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { ScrapedListing } from './dto/scraped-listing.dto';

@Injectable()
export class CvLvScraper {
  async scrape(url: string, category: string): Promise<ScrapedListing[]> {
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      await page.waitForSelector('a.job-title, .vacancy-item, .job-card, .vacancy-list a[href*="/lv/"]', {
        timeout: 15000,
      });

      const html = await page.content();
      return this.parseHtml(html, category);
    } finally {
      await browser.close();
    }
  }

  private parseHtml(html: string, category: string): ScrapedListing[] {
    const $ = cheerio.load(html);
    const listings: ScrapedListing[] = [];

    const items = this.findItems($);
    for (const el of items) {
      const listing = this.extractListing($, el, category);
      if (listing) {
        listings.push(listing);
      }
    }

    return listings;
  }

  private findItems($: cheerio.CheerioAPI): any {
    return $(
      'a.job-title, ' +
        '.vacancy-item, ' +
        '.job-card, ' +
        '.vacancy-list > div, ' +
        '[class*="vacancy"] > div, ' +
        '[class*="job-list"] > div, ' +
        'article, ' +
        'tr[class*="vacancy"]',
    );
  }

  private extractListing(
    $: cheerio.CheerioAPI,
    el: any,
    category: string,
  ): ScrapedListing | null {
    const titleEl = $(el).find('a.job-title, a[href*="/lv/"], h2 a, h3 a, .title a').first();
    const title = titleEl.text().trim() || $(el).find('a').first().attr('title')?.trim() || '';

    if (!title || title.length < 2) {
      return null;
    }

    const href = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
    const url = href.startsWith('http') ? href : `https://cv.lv${href}`;

    const company =
      $(el)
        .find('.company, [class*="company"], .employer, [class*="employer"]')
        .first()
        .text()
        .trim() || null;

    const location =
      $(el)
        .find('.location, [class*="location"], .city, [class*="city"], .place, [class*="place"]')
        .first()
        .text()
        .trim() || null;

    return { title, company, location, url, source: 'cv.lv', category };
  }
}
