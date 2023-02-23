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
 * @returns {Promise<[import("../types/package").IReturnPackageInfo, Error | null]>}
 */
export async function createPackageInfo(userInfo) {
  let packageInfo = {};
  let procedureKode2;
  let [vekselKurs, errors] = await getCurrencyRate(userInfo.valuta);

  if (errors) return [null, errors];

  // Afsender
  packageInfo["Paragraph-XBmZnk_Srq"] = userInfo.afsenderNavn + "\n" + userInfo.afsenderAdresse;
  packageInfo["Paragraph-gkNPApzl3u"] = userInfo.afsenderNavn + "\n" + userInfo.afsenderAdresse;

  // Modtager og klarer/repræsentant
  packageInfo["Paragraph-i50fqh2_X4"] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.modtagerAdresse;
  packageInfo["Paragraph-e5q0m4rY8T"] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.modtagerAdresse;

  packageInfo["Paragraph-XV11j-QheT"] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.modtagerAdresse;
  packageInfo["Paragraph-wGaObkhsZx"] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.modtagerAdresse;

  // Angivelse
  packageInfo["Text-_i-Ij4vfm-"] = "IM";
  packageInfo["Text-2m6m5775oA"] = "A";

  packageInfo["Text-48HtIw2mbQ"] = "IM";
  packageInfo["Text-ie8YPD_3Cp"] = "A";

  // Vareposter
  packageInfo["Text-hiwAnkNgDZ"] = userInfo.varerIAlt.toString();
  packageInfo["Text-krZIKZ8C1L"] = userInfo.varerIAlt.toString();

  // Kolli i alt
  packageInfo["Text-rbiHV68ups"] = userInfo.pakkerIAlt.toString();
  packageInfo["Text-5OZwfBKoeQ"] = userInfo.pakkerIAlt.toString();

  // Værdioplysninger
  packageInfo["Text-3fGwFJumdT"] = toKomma(userInfo.fragtPris.toString() + " " + userInfo.valuta.toString());
  packageInfo["Text-2OaVb3yIok"] = toKomma(userInfo.fragtPris.toString() + " " + userInfo.valuta.toString());

  // Vekselkurs
  packageInfo["Text-vcYrmOBi0r"] = toKomma(vekselKurs.toString().substring(0, 7));
  packageInfo["Text-Ig2RP-DMyu"] = toKomma(vekselKurs.toString().substring(0, 7));

  // Varebeskrivelse
  /* const vareBeskrivelse = userInfo.vareBeskrivelse.split(", ");
   const space = " ";
   packageInfo[14] = varebeskrivelse[0] + "\n";
   packageInfo[15] = "1";
   if (vareBeskrivelse[1]){vareBeskrivelse + "${((space*varebeskrivelse[1].length)-1)}" + "2";}
   if (vareBeskrivelse[2]){vareBeskrivelse + "${((space*varebeskrivelse[2].length)-1)}" + "3";}
   packageInfo[42] = varebeskrivelse[0];
   packageInfo[43] = "1";
   if (vareBeskrivelse[1]){vareBeskrivelse + "${((space*varebeskrivelse[1].length)-1)}" + "2";}
   if (vareBeskrivelse[2]){vareBeskrivelse + "${((space*varebeskrivelse[2].length)-1)}" + "3";}*/

  // Varekode
  packageInfo["Text-lIGpxzVG9K"] = userInfo.vareKode;
  packageInfo["Text-MZHN36Cq6o"] = userInfo.vareKode;

  // Vægt
  packageInfo["Text-Z-0qnHPoNw"] = toKomma((userInfo.vaegtEnhed == "kg" ? userInfo.vaegt : toNum(userInfo.vaegt) * 0.4535924).toString());
  packageInfo["Text-bNe-IGw-2l"] = toKomma((userInfo.vaegtEnhed == "kg" ? userInfo.vaegt : toNum(userInfo.vaegt) * 0.4535924).toString());

  // Procedure koder
  packageInfo["Text-VCTP6H0oqb"] = "4000";
  packageInfo["Text-rmaLuaF7fc"] = "4000";

  if (!userInfo.gave && (toNum(userInfo.fragtPris)+toNum(userInfo.pakkePris))*vekselKurs > 1150){
    procedureKode2 = "";
  } else if (!userInfo.gave){
    procedureKode2 = "C07";
  } else {
    procedureKode2 = "C08";
  }

  packageInfo["Text-ZMQQaEnH75"] = procedureKode2;
  packageInfo["Text-DELFVaUWwe"] = procedureKode2;

  // Statistisk værdi og varepris
  packageInfo["Text-y37_GgETGg"] = toKomma(Math.round(((toNum(userInfo.fragtPris) + toNum(userInfo.pakkePris)) * vekselKurs)).toString() + " DKK");
  packageInfo["Text-I7K5ODHj6N"] = toKomma(Math.round(((toNum(userInfo.fragtPris) + toNum(userInfo.pakkePris)) * vekselKurs)).toString() + " DKK");

  packageInfo["Text-LETnSee-lw"] = toKomma((toNum(userInfo.fragtPris) + toNum(userInfo.pakkePris)).toString() + " " + userInfo.valuta);
  packageInfo["Text-SmAH_sbVkX"] = toKomma((toNum(userInfo.fragtPris) + toNum(userInfo.pakkePris)).toString() + " " + userInfo.valuta);

  // Navn til underskrift
  packageInfo["Text-Nk4H6gS4bF"] = userInfo.modtagerNavn;
  packageInfo["Text--uoJu5kXaW"] = userInfo.modtagerNavn;

  // Beløb og møntsort
  packageInfo["Text-Qu44ql-9Yf"] = userInfo.valuta;
  packageInfo["Text-BdBAFlOpad"] = userInfo.valuta;

  packageInfo["Text-8W0o1rIqF-"] = toKomma(userInfo.pakkePris.toString());
  packageInfo["Text-zSF-wJqykx"] = toKomma(userInfo.pakkePris.toString());

  // lande
  const afsenderLand = userInfo.afsenderLand.split("__")[1]; // afsenderLand er i formatet Kode__Navn
  const afsenderLandKode = userInfo.afsenderLand.split("__")[0];
  packageInfo["Text-Cplh5EoNhS"] = afsenderLand;
  packageInfo["Text-Hhm7UHiU_i"] = afsenderLand;

  packageInfo["Text-iSgQu01Q22"] = afsenderLandKode;
  packageInfo["Text-JpYnmqUvjD"] = afsenderLandKode;

  packageInfo["Text-RrwGZzfWmv"] = "Danmark";
  packageInfo["Text-E2Pi5dt9Lo"] = "Danmark";

  return [packageInfo, null];
}
