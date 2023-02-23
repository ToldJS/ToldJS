import { getCurrencyRate } from '$lib/currencyRates.js'

/**
 * @param {string} str
 * @returns {number}
 */
const toNum = (str) => Number(str.replace(",", "."));
/**
 * @param {string} str
 * @returns {string}
 */
const toKomma = (str) => str.replace(".", ",");

/**
 * @param {import("../types/package").IUserPackageInfo} userInfo
 * @returns {Promise<[import("../types/package").IReturnInfo[], Error | null]>}
 */
export async function createPackageInfo(userInfo) {
  let templatePackageInfo = {};
  let procedureKode2;
  let [vekselKurs, errors] = await getCurrencyRate(userInfo.valuta);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (errors) return [null, errors];

  // Afsender
  templatePackageInfo["Paragraph-XBmZnk_Srq"] = userInfo.afsenderNavn + "\n" + userInfo.afsenderAdresse;
  templatePackageInfo["Paragraph-gkNPApzl3u"] = userInfo.afsenderNavn + "\n" + userInfo.afsenderAdresse;

  // Modtager og klarer/repræsentant
  templatePackageInfo["Paragraph-i50fqh2_X4"] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.modtagerAdresse;
  templatePackageInfo["Paragraph-e5q0m4rY8T"] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.modtagerAdresse;

  templatePackageInfo["Paragraph-XV11j-QheT"] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.modtagerAdresse;
  templatePackageInfo["Paragraph-wGaObkhsZx"] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.modtagerAdresse;

  // Angivelse
  templatePackageInfo["Text-_i-Ij4vfm-"] = "IM";
  templatePackageInfo["Text-2m6m5775oA"] = "A";

  templatePackageInfo["Text-48HtIw2mbQ"] = "IM";
  templatePackageInfo["Text-ie8YPD_3Cp"] = "A";

  // Vareposter
  templatePackageInfo["Text-hiwAnkNgDZ"] = userInfo.varer.length.toString();
  templatePackageInfo["Text-krZIKZ8C1L"] = userInfo.varer.length.toString();

  // Kolli i alt
  templatePackageInfo["Text-rbiHV68ups"] = userInfo.varer.length.toString();
  templatePackageInfo["Text-5OZwfBKoeQ"] = userInfo.varer.length.toString();

  // Værdioplysninger
  templatePackageInfo["Text-3fGwFJumdT"] = toKomma(userInfo.fragtPris.toString() + " " + userInfo.valuta.toString());
  templatePackageInfo["Text-2OaVb3yIok"] = toKomma(userInfo.fragtPris.toString() + " " + userInfo.valuta.toString());

  // Vekselkurs
  templatePackageInfo["Text-vcYrmOBi0r"] = toKomma(vekselKurs.toString().substring(0, 7));
  templatePackageInfo["Text-Ig2RP-DMyu"] = toKomma(vekselKurs.toString().substring(0, 7));

  // Varekode
  templatePackageInfo["Text-lIGpxzVG9K"] = userInfo.vareKode;
  templatePackageInfo["Text-MZHN36Cq6o"] = userInfo.vareKode;

  // Vægt
  templatePackageInfo["Text-Z-0qnHPoNw"] = toKomma((userInfo.vaegtEnhed == "kg" ? userInfo.vaegt : toNum(userInfo.vaegt) * 0.4535924).toString());
  templatePackageInfo["Text-bNe-IGw-2l"] = toKomma((userInfo.vaegtEnhed == "kg" ? userInfo.vaegt : toNum(userInfo.vaegt) * 0.4535924).toString());

  // Procedure koder
  templatePackageInfo["Text-VCTP6H0oqb"] = "4000";
  templatePackageInfo["Text-rmaLuaF7fc"] = "4000";

  if (!userInfo.gave && (toNum(userInfo.fragtPris) + toNum(userInfo.pakkePris)) * vekselKurs > 1150) {
    procedureKode2 = "";
  } else if (!userInfo.gave) {
    procedureKode2 = "C07";
  } else {
    procedureKode2 = "C08";
  }

  templatePackageInfo["Text-ZMQQaEnH75"] = procedureKode2;
  templatePackageInfo["Text-DELFVaUWwe"] = procedureKode2;

  // Statistisk værdi og varepris
  templatePackageInfo["Text-y37_GgETGg"] = toKomma(Math.round(((toNum(userInfo.fragtPris) + toNum(userInfo.pakkePris)) * vekselKurs)).toString() + " DKK");
  templatePackageInfo["Text-I7K5ODHj6N"] = toKomma(Math.round(((toNum(userInfo.fragtPris) + toNum(userInfo.pakkePris)) * vekselKurs)).toString() + " DKK");

  templatePackageInfo["Text-LETnSee-lw"] = toKomma((toNum(userInfo.fragtPris) + toNum(userInfo.pakkePris)).toString() + " " + userInfo.valuta);
  templatePackageInfo["Text-SmAH_sbVkX"] = toKomma((toNum(userInfo.fragtPris) + toNum(userInfo.pakkePris)).toString() + " " + userInfo.valuta);

  // Navn til underskrift
  templatePackageInfo["Text-Nk4H6gS4bF"] = userInfo.modtagerNavn;
  templatePackageInfo["Text--uoJu5kXaW"] = userInfo.modtagerNavn;

  // Møntsort og beløb
  templatePackageInfo["Text-Qu44ql-9Yf"] = userInfo.valuta;
  templatePackageInfo["Text-BdBAFlOpad"] = userInfo.valuta;

  const fakturaPris = userInfo.varer.map(vare => toNum(vare.pris)).reduce((a, b) => a + b, 0);
  templatePackageInfo["Text-8W0o1rIqF-"] = toKomma(fakturaPris.toString());
  templatePackageInfo["Text-zSF-wJqykx"] = toKomma(fakturaPris.toString());

  // Lande
  const afsenderLand = userInfo.afsenderLand.split("__")[1]; // afsenderLand er i formatet Kode__Navn
  const afsenderLandKode = userInfo.afsenderLand.split("__")[0];
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

  let packageInfo = []
  for (let i = 0; i < userInfo.varer.length; i++) {
    const tempPackageInfo = structuredClone(templatePackageInfo);
    const vare = userInfo.varer[i];
    // Varebeskrivelse og vareposter
    tempPackageInfo["Paragraph-GrfeejCUP0"] = vare.antal.toString() + "x " + vare.beskrivelse;
    tempPackageInfo["Paragraph-SiTU2MooOi"] = vare.antal.toString() + "x " + vare.beskrivelse;

    tempPackageInfo["Text-PiYzs293Y0"] = (i + 1).toString();
    tempPackageInfo["Text-Rw3KyxekGY"] = (i + 1).toString();

    packageInfo.push({
      desc: vare.beskrivelse,
      packageInfo: tempPackageInfo
    });
  }

  return [packageInfo, null];
}
