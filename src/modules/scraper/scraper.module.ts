import { Module } from '@nestjs/common';
import { CvLvScraper } from './cv-lv.scraper';

@Module({
  providers: [CvLvScraper],
  exports: [CvLvScraper],
})
export class ScraperModule {}
