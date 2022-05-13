const puppeteer = require("puppeteer");

async function startBrowsing() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log("DangerZone", err);
  }
  return browser;
}
module.exports = {
  startBrowsing,
};
