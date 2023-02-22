import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function parseText(text) {
  let packageInfo = {};
  packageInfo["Sender"] = text.match(/Sender\s+(.*?)\s+From/)?.[1] ?? 'null';
  packageInfo["Origin"] = text.match(/Origin\s+(.*?)\s+Destination/)?.[1] ?? 'null';
  packageInfo["Destination"] = text.match(/Destination\s+(.*?)\s+Weight/)?.[1] ?? 'null';
  packageInfo["Weight"] = text.match(/Weight\s+(\d+(?:\.\d+)?)\s+(g(?:rams)?|kg(?:ilograms)?|lbs?(?:\s+pounds)?)/i)?.[1] ?? 'null';
  packageInfo["Unit"] = text.match(/Weight\s+\d+(?:\.\d+)?\s+((?:g(?:rams)?|kg(?:ilograms)?|lbs?(?:\s+pounds)?))/i)?.[1].toLowerCase() ?? 'null';

  return packageInfo;
}

async function run(tracking_url) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: [
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-sync',
      '--no-sandbox',
    ],
    defaultViewport: null,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.goto("https://parcelsapp.com/en/tracking/" + tracking_url);

  let parsedData;
  try {
    await page.waitForSelector('.parcel-attributes', { timeout: 10000 });
    const text = await page.evaluate(() => document.body.innerText);
    parsedData = await parseText(text);
  } catch (error) {
    parsedData = error;
  }

  await browser.close();

  return parsedData;
}

async function main() {
  let data = await run("LW479465004DE");
  console.log(data);
}

main();
