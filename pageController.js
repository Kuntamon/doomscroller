const pageScraper = require("./pageScraper");
const fs = require("fs");
async function scrapeALL(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    let scrapedData = {};
    // determine the desired category
    scrapedData["Travel"] = await pageScraper.scraper(browser, "Travel");
    scrapedData["Horror"] = await pageScraper.scraper(browser, "Horror");
    scrapedData["Self help"] = await pageScraper.scraper(browser, "Self help");
    await browser.close();
    fs.writeFile(
      "data.json",
      JSON.stringify(scrapedData),
      "utf8",
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("data is at './data.json'");
      }
    );
  } catch (err) {
    //console.log(scrapedData);
    //await pageScraper.scraper(browser);
    console.log("STOP IN THE NAME OF ERROR", err);
  }
}

module.exports = (browserInstance) => scrapeALL(browserInstance);
