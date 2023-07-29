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
  await page.goto('https://jestjs.io/docs/getting-started');

  // Create a new PDF document
  const pdfDoc = new PDFDocument();

  const scrapePage = async () => {
    const stopUrl = 'https://jestjs.io/docs/upgrading-to-jest29';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const url = page.url();
      console.log(`Scraping page: ${url}`);

      if (url === stopUrl) {
        console.log('Stop URL reached. Exiting...');
        break;
      }

      await page.waitForSelector('.theme-doc-markdown.markdown');
      const divElement = await page.$('.theme-doc-markdown.markdown');

      // Retrieve the text content of the div element
      const text = await page.evaluate(element => element.textContent, divElement);

      // Append the text content to the PDF document
      pdfDoc.text(text);

      console.log('Div scraped:', url);

      let nextButton;
      if (await page.$('.pagination-nav__link--next')) {
        nextButton = await page.$('.pagination-nav__link--next');
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
    const outputStream = fs.createWriteStream('jestDocs.pdf');
    pdfDoc.pipe(outputStream);

    // Finalize the PDF document
    pdfDoc.end();

    console.log(`Pages scraped: ${stopUrl}`);
  };

  await scrapePage();

  await browser.close();
})();
