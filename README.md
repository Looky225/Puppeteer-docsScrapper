# Puppeteer-docsScrapper
Node.js script that uses Puppeteer and PDFKit libraries to scrape text from a documentation website and convert it into a PDF file.


Documentation Scraping with Puppeteer and PDFKit
This Node.js script utilizes Puppeteer and PDFKit libraries to scrape text from a website's documentation and convert it into a PDF file. The script is designed to be reusable for different websites, as you can adapt the selectors and customize the script to work with other websites' documentation.

How to Use
Make sure you have Node.js installed on your system.

Clone this repository and navigate to the root directory.

Install the required dependencies by running the following command:

bash
Copy code
npm install puppeteer pdfkit fs
Copy the provided script into a new file, e.g., scrape.js.

Customize the script to match the structure of the website's documentation you want to scrape:

Adjust the URL in await page.goto('https://nextjs.org/docs'); to point to the website's documentation you want to scrape.
Modify the selectors used in await page.waitForSelector('.pagination_align-right__0nLuq'); and await page.$('.prose.prose-vercel.max-w-none'); to target the relevant elements on the website's documentation pages.
Run the script using Node.js:

bash
Copy code
node scrape.js
The script will launch a headless browser, navigate to the specified website's documentation, and start scraping the content.

The scraped text will be stored in a PDF file named scraped_text.pdf in the root directory.

Note
The script is designed to stop when it reaches a specific page with the URL 'https://nextjs.org/docs/community/contribution-guide'. You can change the stopUrl variable in the script to stop at a different page if needed.

The script uses a delay of 500 milliseconds between page navigations to allow for proper page loading. You can adjust this delay if necessary.

Contributions
Contributions to this repository are welcome! If you find any issues, have suggestions for improvements, or want to add more features, feel free to open a pull request.

Disclaimer
This project serves educational and personal purposes. Users are responsible for complying with the terms of service of the websites they scrape. The authors and contributors of this repository are not responsible for any misuse of the script or any consequences arising from it. Use the code responsibly and respect the policies of the websites you interact with.

Happy scraping !

Author: Assante Ahmad
Email: loukmanassante@outlook.com
