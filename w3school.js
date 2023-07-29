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
  await page.goto('https://www.w3schools.com/jsrEF/default.asp');

  // Create a new PDF document
  const pdfDoc = new PDFDocument();
  
  // Set the document headers
  pdfDoc
    .fillColor('black')
    .fontSize(12)
    .text('Scraped W3Schools Documentation', {
      align: 'center',
    });

  const scrapePage = async () => {
    const stopUrl = 'https://www.w3schools.com/jsrEF/jsref_type_conversion.asp';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const url = page.url();
      console.log(`Scraping page: ${url}`);

      // Check if the current URL matches the stop URL
      if (url === stopUrl) {
        console.log('Stop URL reached. Exiting...');
        break;
      }

      await page.waitForSelector('.w3-col');
      const divElement = await page.$('.w3-col');

      // Retrieve the text content of the div element
      const text = await page.evaluate(element => element.textContent, divElement);

      // Append the text content to the PDF document
      pdfDoc.text(text);

      console.log('Div scraped:', url);

      let nextButton;
      if (await page.$('a.w3-right')) {
        nextButton = await page.$('a.w3-right');
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

      // Check if the next URL is the login page
      if (nextPageUrl.includes('profile.w3schools.com/log-in')) {
        console.log('Login page encountered. Exiting...');
        break;
      }

      await Promise.all([
        page.waitForNavigation({ timeout: 30000 }),
        nextButton.click(),
      ]);

      await delay(1000); // Longer delay of 1 second
    }

    // Pipe the PDF document to a file
    const outputStream = fs.createWriteStream('w3schoolsDoc.pdf');
    pdfDoc.pipe(outputStream);

    // Finalize the PDF document
    pdfDoc.end();

    console.log(`Pages scraped: ${stopUrl}`);
  };

  await scrapePage();

  await browser.close();
})();