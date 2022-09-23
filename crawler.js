// web crawling
import { gotScraping } from "got-scraping";
import cheerio from "cheerio";

const WEBSITE_URL = "https://demo-webstore.apify.org/";

const response = await gotScraping(WEBSITE_URL);
const html = response.body;

const $ = cheerio.load(html);

const productLinks = $('main.fit a[href*="/product/"]');

// Prepare an empty array for our product Urls
const productsToScrape = [];

for (const link of productLinks) {
  const relativeUrl = $(link).attr("href");
  const absoluteUrl = new URL(relativeUrl, WEBSITE_URL);

  // add each product link to our array
  productsToScrape.push(absoluteUrl.href);
}

// Loop over the stored URLs to process each
// product page individually
for (const link of productsToScrape) {
  try {
    // Download HTML.
    const productResponse = await gotScraping(link);
    const productHTML = productResponse.body;

    // Load into Cheerio to test the HTML.
    // We use $$ to avoid confusion with $ variable above.
    const $$ = cheerio.load(productHTML);

    // Extract the product's title from the <h3> tag
    const productPageTitle = $$("h3").text();

    // Print the title to the terminal to see
    // whether we downloaded the correct HTML.
    console.log(productPageTitle);
  } catch (error) {
    // In the catch block, we handle errors.
    // This time, we will just print
    // the error message and the url.
    console.error(error.message, link);
  }
}
