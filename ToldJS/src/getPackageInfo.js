import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import pdfjsLib from 'pdfjs-dist';

puppeteer.use(StealthPlugin());

async function parsePDF(pdfBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
  const numPages = pdf.numPages; // get the number of pages
  let text = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const pageText = await page.getTextContent().then((textContent) => {
      return textContent.items.map((item) => item.str).join(' ');
    });
    text += pageText + ' ';
  }
  let packageInfo = [];
  packageInfo[0] = text.match(/Sender\s+(.*?)\s+From/)?.[1] ?? 'null';
  packageInfo[1] = text.match(/Origin\s+(.*?)\s+Destination/)?.[1] ?? 'null';
  packageInfo[2] = text.match(/Destination\s+(.*?)\s+Weight/)?.[1] ?? 'null';
  packageInfo[3] = text.match(/Weight\s+(\d+(?:\.\d+)?)\s+(g(?:rams)?|kg(?:ilograms)?|lbs?(?:\s+pounds)?)/i)?.[1] ?? 'null';
  packageInfo[4] = text.match(/Weight\s+\d+(?:\.\d+)?\s+((?:g(?:rams)?|kg(?:ilograms)?|lbs?(?:\s+pounds)?))/i)?.[1] ?? 'null';
  packageInfo[5] = text.match(/Sender reference\s+(\S+)/)?.[1] ?? 'null';

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
  await page.waitForSelector('.parcel-attributes', { timeout: 20000 });

  // Generate PDF and save it to disk
  const pdfBuffer = await page.pdf({ format: 'A4' });

  // Parse PDF content
  const parsedData = await parsePDF(pdfBuffer);

  await browser.close();

  return parsedData;
}

async function main() {
  let data = await run("LW479465004DE");
  console.log(data);
}

main();
