const PDFDocument = require('pdfkit');
const fs = require('fs');
const puppeteer = require('puppeteer');

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://javascript.info/popup-windows');

  // Create a new PDF document
  const pdfDoc = new PDFDocument();

  const scrapePage = async () => {
    const stopUrl = 'https://javascript.info/regexp-methods';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const url = page.url();
      console.log(`Scraping page: ${url}`);

      // Check if the current URL matches the stop URL
      if (url === stopUrl) {
        console.log('Stop URL reached. Exiting...');
        break;
      }

      await page.waitForSelector('.main.main_width-limit');
      const divElement = await page.$('.main.main_width-limit');

      // Retrieve the text content of the div element
      const text = await page.evaluate(element => element.textContent, divElement);

      // Append the text content to the PDF document
      pdfDoc.text(text);

      console.log('Div scraped:', url);

      let nextButton;
      if (await page.$('.page__nav.page__nav_next')) {
        nextButton = await page.$('.page__nav.page__nav_next');
      } else {
        console.log('Next button not found. Exiting...');
        break;
      }

      const nextPageUrl = await page.evaluate(element => element.href, nextButton);

      console.log('Clicking on next button:', nextPageUrl);

      // Check if the next URL is the stop URL
      if (nextPageUrl === stopUrl) {
        console.log('Stop URL reached. Exiting...');
        break;
      }

      await Promise.all([
        page.waitForNavigation({ timeout: 30000 }),
        nextButton.click(),
      ]);

      await delay(500);
    }

    // Pipe the PDF document to a file
    const outputStream = fs.createWriteStream('javascriptInfoPt3.pdf');
    pdfDoc.pipe(outputStream);

    // Finalize the PDF document
    pdfDoc.end();

    console.log(`Pages scraped: ${stopUrl}`);
  };

  await scrapePage();

  await browser.close();
})();
