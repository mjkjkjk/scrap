import { Browser } from "puppeteer";
import { Scraper } from "./scraper";

export const IbsScraper: Scraper = (browser: Browser) => async (title: string) => {
    // home
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    await page.goto("https://www.ibs.it/");
  
    // search
    await page.type("#inputSearch", title);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
  
    // scrape data
    const searchResults = await page.$$(".cc-product-list-item > div");
    const results = await Promise.all(
      searchResults.map(async (handle) => {
        const anchor = await handle.$("a")
        const href = await anchor.getProperty("href")
        const link = await href.jsonValue()
  
        const title = await anchor.evaluate(e => e.textContent.trim())
        const authorElements = await handle.$$(".cc-author-name")
        
        const authorsPromise = authorElements.map(h => h.evaluate(e => e.textContent.trim()))
  
        const authors = await Promise.all(authorsPromise)
  
        const priceElement = await handle.$(".cc-price")
        // TODO trim comma at the end
        const price = await priceElement.evaluate(e => e.textContent.trim())
  
        const categoryElements = await handle.$$(".cc-category")
        const categoryPromise = categoryElements.map(h => h.evaluate(e => e.textContent.trim()))
  
        const categories = await Promise.all(categoryPromise)
  
        return {
          title,
          link,
          price,
          authors,
          categories
        }
      })
    )
  
    await page.close()
  
    return results
  };