import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';

/**
 * @param {(string | undefined)[]} packageInfo
 * @param {import("fs").PathLike} output
 */
export async function fillPdf(packageInfo, output) {
    const pdf = await PDFDocument.load(await fs.readFile("./static/Enhedsdokument.pdf"));

    const form = pdf.getForm();
    const fieldNames = form.getFields().map(f => f.getName());

    for (let i = 0; i < fieldNames.length; i++) {
        form.getTextField(fieldNames[i]).setText(packageInfo[i]);
    }

    const pdfBytes = await pdf.save();
    await fs.writeFile(output, pdfBytes);
}