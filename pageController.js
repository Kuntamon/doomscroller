const pageScraper = require("./pageScraper");
async function scrapeALL(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    await pageScraper.scraper(browser);
  } catch (err) {
    console.log("STOP IN THE NAME OF ERROR", err);
  }
}

module.exports = (browserInstance) => scrapeALL(browserInstance);
