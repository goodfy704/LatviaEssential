export interface ScrapedListing {
  title: string;
  company: string | null;
  location: string | null;
  url: string;
  source: string;
  category: string;
}
