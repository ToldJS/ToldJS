import { getCurrencyRate } from '$lib/currencyRates.js'

/**
 * @param {string} str
 */
const toNum = (str) => Number(str.replace(",", "."));

/**
 * @param {import("../types/package").IUserPackageInfo} userInfo
 */
export async function createPackageInfo(userInfo) {
  let packageInfo = {};
  let procedureKode2;
  let vekselKurs = await getCurrencyRate(userInfo.valuta);

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
  packageInfo["Text-3fGwFJumdT"] = userInfo.fragtPris.toString() + " " + userInfo.valuta.toString();
  packageInfo["Text-2OaVb3yIok"] = userInfo.fragtPris.toString() + " " + userInfo.valuta.toString();

  // Vekselkurs
  packageInfo["Text-vcYrmOBi0r"] = vekselKurs.toString().substring(0, 7);
  packageInfo["Text-Ig2RP-DMyu"] = vekselKurs.toString().substring(0, 7);

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
  packageInfo["Text-Z-0qnHPoNw"] = userInfo.vaegtEnhed == "kg" ? userInfo.vaegt : toNum(userInfo.vaegt) * 0.4535924;
  packageInfo["Text-bNe-IGw-2l"] = userInfo.vaegtEnhed == "kg" ? userInfo.vaegt : toNum(userInfo.vaegt) * 0.4535924;

  // Procedure koder
  packageInfo["Text-VCTP6H0oqb"] = "4000";
  packageInfo["Text-rmaLuaF7fc"] = "4000";

  if (!userInfo.gave && (toNum(userInfo.fragtPris)+toNum(userInfo.pakkePris))*vekselKurs > 1150){
    procedureKode2 = "C07";
  } else if (!userInfo.gave){
    procedureKode2 = "";
  } else {
    procedureKode2 = "C08";
  }
  
  packageInfo["Text-ZMQQaEnH75"] = procedureKode2;
  packageInfo["Text-DELFVaUWwe"] = procedureKode2;

  // Statistisk værdi og varepris
  packageInfo["Text-y37_GgETGg"] = Math.round(((toNum(userInfo.fragtPris)+toNum(userInfo.pakkePris))*vekselKurs)).toString() + " DKK";
  packageInfo["Text-I7K5ODHj6N"] = Math.round(((toNum(userInfo.fragtPris)+toNum(userInfo.pakkePris))*vekselKurs)).toString() + " DKK";

  packageInfo["Text-LETnSee-lw"] = (toNum(userInfo.fragtPris)+toNum(userInfo.pakkePris)).toString() + " " + userInfo.valuta;
  packageInfo["Text-SmAH_sbVkX"] = (toNum(userInfo.fragtPris)+toNum(userInfo.pakkePris)).toString() + " " + userInfo.valuta;

  // Navn til underskrift
  packageInfo["Text-Nk4H6gS4bF"] = userInfo.modtagerNavn;
  packageInfo["Text--uoJu5kXaW"] = userInfo.modtagerNavn;

  // Beløb og møntsort
  packageInfo["Text-Qu44ql-9Yf"] = userInfo.valuta;
  packageInfo["Text-BdBAFlOpad"] = userInfo.valuta;

  packageInfo["Text-LETnSee-lw"] = userInfo.pakkePris.toString();
  packageInfo["Text-SmAH_sbVkX"] = userInfo.pakkePris.toString();
  
  // lande
  const afsenderLand = userInfo.afsenderLand.split("__")[1]; // afsenderLand er i formatet Kode__Navn
  const afsenderLandKode = userInfo.afsenderLand.split("__")[0];
  packageInfo["Text-Cplh5EoNhS"] = afsenderLand;
  packageInfo["Text-Hhm7UHiU_i"] = afsenderLand;
  
  packageInfo["Text-iSgQu01Q22"] = afsenderLandKode;
  packageInfo["Text-JpYnmqUvjD"] = afsenderLandKode;

  packageInfo["Text-RrwGZzfWmv"] = "Danmark";
  packageInfo["Text-E2Pi5dt9Lo"] = "Danmark";

  return packageInfo;
}