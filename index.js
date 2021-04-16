/**
 * insert URLs here
 */
const urls = ["https://www.amazon.com/", "https://www.google.com/"];

// run the task
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  const collect = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    return await page.evaluate(() => {
      const list = [];
      const elements = document.getElementsByTagName("*");
      for (let elm of elements) {
        const className = elm.getAttribute("class");
        if (className !== null) {
          for (let name of className.split(" ")) {
            if (name) {
              list.push(name);
            }
          }
        }
      }
      return list;
    });
  };

  const allClasses = (await Promise.all(urls.map(collect))).flat();
  const uniqueClasses = new Set(allClasses);

  console.log(allClasses, "\nDone! Press Control+C to terminate.");

  const fs = require("fs");
  const file = fs.createWriteStream("css_classes.txt");
  file.on("error", function (err) {
    console.error(err);
  });
  uniqueClasses.forEach(function (el) {
    file.write(el + "\n");
  });
  file.end();
})();
