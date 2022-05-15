// scrapes all of the books that are in stock from all product page
const scraperObject = {
  url: "http://books.toscrape.com",
  async scraper(browser, category) {
    let page = await browser.newPage();
    await page.goto(this.url);
    let selectedCategory = await page.$$eval(
      ".side_categories > ul > li > ul > li > a",
      (links, _category) => {
        // Search for the element that has the matching text
        links = links.map((a) =>
          a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") ===
          _category
            ? a
            : null
        );
        let link = links.filter((tx) => tx !== null)[0];
        return link.href;
      },
      category
    );
    // Navigate to the selected category
    await page.goto(selectedCategory);
    let scrapedData = [];
    //wait
    async function scrapeCurrentPage() {
      await page.waitForSelector(".page_inner");
      // hrefs for the books
      let urls = await page.$$eval("section ol > li", (links) => {
        links = links.filter(
          (link) =>
            link.querySelector(".instock.availability > i").textContent !==
            "in stock"
        );
        links = links.map((el) => el.querySelector("h3 > a").href);
        return links;
      });

      // Open every link to find relevant data about every book
      let pagePromise = (link) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();
          await newPage.goto(link);
          dataObj["bookTitle"] = await newPage.$eval(
            ".product_main > h1",
            (text) => text.textContent
          );
          dataObj["bookPrice"] = await newPage.$eval(
            ".price_color",
            (text) => text.textContent
          );
          dataObj["noAvailable"] = await newPage.$eval(
            ".instock.availability",
            (text) => {
              //take out the new lines and use tabs for spacing
              text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
              //number of the books available
              let regexp = /^.*\((.*)\).*$/i;
              let stockAvailable = regexp.exec(text)[1].split(" ")[0];
              return stockAvailable;
            }
          );
          dataObj["imageUrl"] = await newPage.$eval(
            "#product_gallery img",
            (img) => img.src
          );
          dataObj["bookDescription"] = await newPage.$eval(
            "#product_description",
            (div) => div.nextSibling.textContent
          );
          dataObj["upc"] = await newPage.$eval(
            ".table.table-striped > tbody > tr > td",
            (table) => table.textContent
          );
          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        scrapedData.push(currentPageData);
        //console.log(currentPageData);
      }
      //look for a next button to reduce stacks
      let nextButtonExist = false;
      try {
        const nextButton = await page.$eval(".next > a", (a) => a.textContent);
        nextButtonExist = true;
      } catch (err) {
        nextButtonExist = false;
      }
      if (nextButtonExist) {
        await page.click(".next > a");
        return scrapeCurrentPage();
      }
      await page.close();
      return scrapedData;
    }
    let data = await scrapeCurrentPage();
    console.log(data);
    return data;
  },
};

module.exports = scraperObject;
