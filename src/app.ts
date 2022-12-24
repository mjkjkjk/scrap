import dotenv from "dotenv";
import express from "express";
import puppeteer, { Browser, Keyboard } from "puppeteer";
import { IbsScraper } from "./scraper/ibs";

// load the environment variables from the .env file
dotenv.config({
  path: ".env",
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
  public browser;

  public constructor(browser: Browser) {
    this.browser = browser
  }

  public app = express()
    .get("/api/search", async (req, res) => {
      const query = req.query.q as string;
      const scraper = IbsScraper(this.browser)
      const results = await scraper(query);

      res.send(results);
    });
}

puppeteer.launch().then((browser) => {
  // initialize server app
  const server = new Server(browser);

  // make server listen on some port
  ((port = process.env.APP_PORT || 5000) => {
    server.app.listen(port, () => console.log(`> Listening on port ${port}`));
  })();


  // TODO call browser close ???
});
