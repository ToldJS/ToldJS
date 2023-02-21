import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import pdfjsLib from 'pdfjs-dist';

import express from 'express';
import cors from 'cors';
const app = express();
const port = 8089;

app.use(cors());
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
  console.log(text);
  let packageInfo = {};
  packageInfo["Sender"] = text.match(/Sender\s+(.*?)\s+From/)?.[1] ?? 'null';
  packageInfo["Origin"] = text.match(/Origin\s+(.*?)\s+Destination/)?.[1] ?? 'null';
  packageInfo["Destination"] = text.match(/Destination\s+(.*?)\s+Weight/)?.[1] ?? 'null';
  packageInfo["Weight"] = text.match(/Weight\s+(\d+(?:\.\d+)?)\s+(g(?:rams)?|kg(?:ilograms)?|lbs?(?:\s+pounds)?)/i)?.[1] ?? 'null';
  packageInfo["Unit"] = text.match(/Weight\s+\d+(?:\.\d+)?\s+((?:g(?:rams)?|kg(?:ilograms)?|lbs?(?:\s+pounds)?))/i)?.[1] ?? 'null';

  return packageInfo;
}

async function run(tracking_url) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
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
    // Generate PDF and save it to disk
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Parse PDF content
    parsedData = await parsePDF(pdfBuffer);
  } catch (error) {
    parsedData = { error: error.message };
  }

  await browser.close();

  return parsedData;
}

// Make sure tracking is a string
async function getParcel(tracking = 'null') {
  if (typeof tracking !== 'string' || tracking === 'null') {
      return {'error': 'Tracking number invalid'};
  }
  try {
      let data = await run(tracking);
      return data;
  }
  catch (error) {
      console.log(error);
      return {'error': error};
  }
}


app.get('/getParcel', async (req, res) => {
  let tracking = req.query.tracking;
  let data = await getParcel(tracking);
  res.send(data);
});

app.listen(port, () => {
  console.log(`ParcelAPI listening at http://localhost:${port}`);
});
