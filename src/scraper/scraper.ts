import { Browser } from "puppeteer"

export interface ScrapeResult {
    title: string,
    link: string,
    price: string,
    authors: string[],
    categories: string[]
}

export type Scraper = (browser: Browser) => (query: string) => Promise<ScrapeResult[]>