import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';

/**
 * @param {(string | undefined)[]} packageInfo
 * @param {import("fs").PathLike} output
 */
export async function fillPdf(packageInfo, output) {
    const pdf = await PDFDocument.load(await fs.readFile("./static/Enhedsdokument_6_7.pdf"));

    const form = pdf.getForm();
    const fieldNames = form.getFields().map(f => f.getName());

    for (let i = 0; i < fieldNames.length; i++) {
        form.getTextField(fieldNames[i]).setText(packageInfo[i]);
    }

    const pdfBytes = await pdf.save();
    await fs.writeFile(output, pdfBytes);
}
/*
fillPdf([
  'afsendernavn\nafsenderadresse\nafsenderby',
  'IM',
  'A',
  '2',
  '1',
  'M',
  'DK09999981\nmodtagernavn\nmodtageradresse',
  , ,
  '100 usd',
  "", "", "",
  '7',
  , ,
  "7007000",
  "",
  'trackingnumber',
 "" , "",
  '12',
  'varekode',
  '4000',
  "undefined",
  'modtagernavn',
  'DK09999981\nmodtagernavn\nmodtageradresse',
  'afsendernavn\nafsenderadresse\nafsenderby',
  'DK09999981\nmodtagernavn\nmodtageradresse',
  'DK09999981\nmodtagernavn\nmodtageradresse',
  'IM',
  'A',
  '2',
  '1',
  'M',
  '100 usd',
  "","" ,"" ,"" ,
  
  '7',
  , , ,
  'varekode',
  "",
  '12',
  '4000',
  "undefined",
  'trackingnumber',
 "", "",
  "7007000",
  'modtagernavn'
], "./output.pdf");
*/