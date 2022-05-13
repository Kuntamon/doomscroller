const browserObject = require("./browser");
const scraperController = require("./pageController");

let browserInstance = browserObject.startBrowsing();

scraperController(browserInstance);
