import { getCurrencyRate } from '$lib/currencyRates.js'
import type { inputSchema, IReturnInfo, IReturnPackageInfo } from '$lib/types/package';


const toNum = (str: string): number => Number(str.replace(",", "."));

const toKomma = (str: string): string => str.replace(".", ",");

export async function createPackageInfo(providedInfo: inputSchema): Promise<[IReturnInfo[], Error | null]> {
  let templatePackageInfo: IReturnPackageInfo = {};
  let procedureKode2;
  const [vekselKurs, errors] = await getCurrencyRate(providedInfo.pakkeinfo.valuta);
  // sum all varepriser
  const pakkePris = providedInfo.varer.reduce((sum, vare) => sum + toNum(vare.pris), 0);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (errors) return [null, errors];

  // Afsender
  templatePackageInfo["Paragraph-XBmZnk_Srq"] = providedInfo.afsender.navn + "\n" + providedInfo.afsender.addresse;
  templatePackageInfo["Paragraph-gkNPApzl3u"] = providedInfo.afsender.navn + "\n" + providedInfo.afsender.addresse;

  // Modtager og klarer/repræsentant
  templatePackageInfo["Paragraph-i50fqh2_X4"] = "DK09999981\n" + providedInfo.modtager.navn + "\n" + providedInfo.modtager.addresse;
  templatePackageInfo["Paragraph-e5q0m4rY8T"] = "DK09999981\n" + providedInfo.modtager.navn + "\n" + providedInfo.modtager.addresse;

  templatePackageInfo["Paragraph-XV11j-QheT"] = "DK09999981\n" + providedInfo.modtager.navn + "\n" + providedInfo.modtager.addresse;
  templatePackageInfo["Paragraph-wGaObkhsZx"] = "DK09999981\n" + providedInfo.modtager.navn + "\n" + providedInfo.modtager.addresse;

  // Angivelse
  templatePackageInfo["Text-_i-Ij4vfm-"] = "IM";
  templatePackageInfo["Text-2m6m5775oA"] = "A";

  templatePackageInfo["Text-48HtIw2mbQ"] = "IM";
  templatePackageInfo["Text-ie8YPD_3Cp"] = "A";

  // Vareposter
  templatePackageInfo["Text-hiwAnkNgDZ"] = providedInfo.varer.length.toString();
  templatePackageInfo["Text-krZIKZ8C1L"] = providedInfo.varer.length.toString();

  // Kolli i alt
  templatePackageInfo["Text-rbiHV68ups"] = providedInfo.varer.length.toString();
  templatePackageInfo["Text-5OZwfBKoeQ"] = providedInfo.varer.length.toString();

  // Værdioplysninger
  templatePackageInfo["Text-3fGwFJumdT"] = toKomma(providedInfo.pakkeinfo.fragtpris.toString() + " " + providedInfo.pakkeinfo.valuta.toString());
  templatePackageInfo["Text-2OaVb3yIok"] = toKomma(providedInfo.pakkeinfo.fragtpris.toString() + " " + providedInfo.pakkeinfo.valuta.toString());

  // Vekselkurs
  templatePackageInfo["Text-vcYrmOBi0r"] = toKomma(vekselKurs.toString().substring(0, 7));
  templatePackageInfo["Text-Ig2RP-DMyu"] = toKomma(vekselKurs.toString().substring(0, 7));

  // Vægt
  const num = providedInfo.pakkeinfo.vægtEnhed == "kg" ? toNum(providedInfo.pakkeinfo.vægt) : toNum(providedInfo.pakkeinfo.vægt) * 0.4535924;
  const roundedNum = num >= 1 ? Math.round(num).toString() : num.toString().substring(0, 7); 

  templatePackageInfo["Text-Z-0qnHPoNw"] = toKomma(roundedNum);
  templatePackageInfo["Text-bNe-IGw-2l"] = toKomma(roundedNum);

  // Procedure koder
  templatePackageInfo["Text-VCTP6H0oqb"] = "4000";
  templatePackageInfo["Text-rmaLuaF7fc"] = "4000";

  if (!providedInfo.pakkeinfo.gave && (toNum(providedInfo.pakkeinfo.fragtpris) + pakkePris) * vekselKurs > 1150) {
    procedureKode2 = "";
  } else if (!providedInfo.pakkeinfo.gave) {
    procedureKode2 = "C07";
  } else {
    procedureKode2 = "C08";
  }

  templatePackageInfo["Text-ZMQQaEnH75"] = procedureKode2;
  templatePackageInfo["Text-DELFVaUWwe"] = procedureKode2;

  // Statistisk værdi
  templatePackageInfo["Text-y37_GgETGg"] = toKomma(Math.round(((toNum(providedInfo.pakkeinfo.fragtpris) + pakkePris) * vekselKurs)).toString() + " DKK");
  templatePackageInfo["Text-I7K5ODHj6N"] = toKomma(Math.round(((toNum(providedInfo.pakkeinfo.fragtpris) + pakkePris) * vekselKurs)).toString() + " DKK");

  // Navn til underskrift
  templatePackageInfo["Text-Nk4H6gS4bF"] = providedInfo.modtager.navn;
  templatePackageInfo["Text--uoJu5kXaW"] = providedInfo.modtager.navn;

  // Møntsort og beløb
  templatePackageInfo["Text-Qu44ql-9Yf"] = providedInfo.pakkeinfo.valuta;
  templatePackageInfo["Text-BdBAFlOpad"] = providedInfo.pakkeinfo.valuta;

  const fakturaPris = providedInfo.varer.map(vare => toNum(vare.pris)).reduce((a, b) => a + b, 0);
  templatePackageInfo["Text-8W0o1rIqF-"] = toKomma(fakturaPris.toString());
  templatePackageInfo["Text-zSF-wJqykx"] = toKomma(fakturaPris.toString());

  // Lande
  const afsenderLand = providedInfo.afsender.land.split("__")[1]; // afsenderLand er i formatet Kode__Navn
  const afsenderLandKode = providedInfo.afsender.land.split("__")[0];
  templatePackageInfo["Text-Cplh5EoNhS"] = afsenderLand;
  templatePackageInfo["Text-Hhm7UHiU_i"] = afsenderLand;

  templatePackageInfo["Text-iSgQu01Q22"] = afsenderLandKode;
  templatePackageInfo["Text-JpYnmqUvjD"] = afsenderLandKode;

  templatePackageInfo["Text-RrwGZzfWmv"] = "Danmark";
  templatePackageInfo["Text-E2Pi5dt9Lo"] = "Danmark";

  // set temp values
  templatePackageInfo["Paragraph-GrfeejCUP0"] = "";
  templatePackageInfo["Paragraph-SiTU2MooOi"] = "";

  templatePackageInfo["Text-PiYzs293Y0"] = "";
  templatePackageInfo["Text-Rw3KyxekGY"] = "";

  templatePackageInfo["Text-LETnSee-lw"] = "";
  templatePackageInfo["Text-SmAH_sbVkX"] = "";

  templatePackageInfo["Text-lIGpxzVG9K"] = "";
  templatePackageInfo["Text-MZHN36Cq6o"] = "";

  let packageInfo = []
  for (let i = 0; i < providedInfo.varer.length; i++) {
    const tempPackageInfo = structuredClone(templatePackageInfo);
    const vare = providedInfo.varer[i];
    // Varebeskrivelse og vareposter
    tempPackageInfo["Paragraph-GrfeejCUP0"] = vare.antal.toString() + "x " + vare.beskrivelse;
    tempPackageInfo["Paragraph-SiTU2MooOi"] = vare.antal.toString() + "x " + vare.beskrivelse;

    tempPackageInfo["Text-LETnSee-lw"] = toKomma(vare.pris + " " + providedInfo.pakkeinfo.valuta);
    tempPackageInfo["Text-SmAH_sbVkX"] = toKomma(vare.pris + " " + providedInfo.pakkeinfo.valuta);

    tempPackageInfo["Text-lIGpxzVG9K"] = vare.varekode;
    tempPackageInfo["Text-MZHN36Cq6o"] = vare.varekode;

    tempPackageInfo["Text-PiYzs293Y0"] = (i + 1).toString();
    tempPackageInfo["Text-Rw3KyxekGY"] = (i + 1).toString();

    packageInfo.push({
      desc: vare.beskrivelse,
      packageInfo: tempPackageInfo
    });
  }

  return [packageInfo, null];
}
