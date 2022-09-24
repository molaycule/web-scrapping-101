// crawlee.js
import { CheerioCrawler, Dataset } from "crawlee";

const crawler = new CheerioCrawler({
  requestHandler: async ({ $, request, enqueueLinks }) => {
    if (request.label === "START") {
      await enqueueLinks({
        selector: 'a[href*="/product/"]',
        baseUrl: new URL(request.url).origin
      });

      // When on the START page, we don't want to
      // extract any data after we extract the links.
      return;
    }

    // We copied and pasted the extraction code
    // from the previous lesson
    const title = $("h3").text().trim();
    const price = $("h3 + div").text().trim();
    const description = $('div[class*="Text_body"]').text().trim();

    // Instead of saving the data to a variable,
    // we immediately save everything to a file.
    await Dataset.pushData({
      title,
      description,
      price
    });
  }
});

await crawler.addRequests([
  {
    url: "https://demo-webstore.apify.org/search/on-sale",
    // By labeling the Request, we can very easily
    // identify it later in the requestHandler.
    userData: {
      label: "START"
    }
  }
]);

await crawler.run();
