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
  await page.goto('https://nextjs.org/docs');

  // Create a new PDF document
  const pdfDoc = new PDFDocument();

  const scrapePage = async () => {
    const stopUrl = 'https://nextjs.org/docs/community/contribution-guide';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const url = page.url();
      console.log(`Scraping page: ${url}`);

      // Check if the current URL matches the stop URL
      if (url === stopUrl) {
        console.log('Stop URL reached. Exiting...');
        break;
      }

      await page.waitForSelector('.pagination_align-right__0nLuq');
      const nextButton = await page.$('.pagination_align-right__0nLuq');

      // Retrieve the text content of the div element
      const divElement = await page.$('.prose.prose-vercel.max-w-none');
      const text = await page.evaluate(element => element.textContent, divElement);

      // Append the text content to the PDF document
      pdfDoc.text(text);

      console.log('Div scraped:', url);

      const nextPageTitle = await nextButton.$eval('.text_wrapper__i87JK', el => el.textContent);
      console.log('Clicking on next button:', nextPageTitle);

      await Promise.all([
        page.waitForNavigation({ timeout: 30000 }),
        nextButton.click(),
      ]);

      await delay(500);
    }

    // Pipe the PDF document to a file
    const outputStream = fs.createWriteStream('scraped_text.pdf');
    pdfDoc.pipe(outputStream);

    // Finalize the PDF document
    pdfDoc.end();

    console.log(`Pages scraped: ${stopUrl}`);
  };

  await scrapePage();

  await browser.close();
})();
