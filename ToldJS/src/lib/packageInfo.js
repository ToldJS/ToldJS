export function createPackageInfo(userInfo) {
  let packageInfo = Array(53);

  // Afsender
  packageInfo[0] = userInfo.afsenderNavn + "\n" + userInfo.afsenderAdresse + "\n" + userInfo.afsenderBy;
  packageInfo[27] = userInfo.afsenderNavn + "\n" + userInfo.afsenderAdresse + "\n" + userInfo.afsenderBy;

  // Modtager
  packageInfo[6] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.adresse;
  packageInfo[28] = "DK09999981\n" + userInfo.modtagerNavn + "\n" + userInfo.adresse;

  // Angivelse
  packageInfo[1] = "IM";
  packageInfo[2] = "A"; 

  packageInfo[30] = "IM";
  packageInfo[31] = "A"; 
  
  return packageInfo;
}