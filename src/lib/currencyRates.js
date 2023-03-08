/**
 * @param {string} valuta
 * @returns {Promise<[number, Error | null]>}
 */
export async function getCurrencyRate(valuta) {
  if (valuta.toLowerCase() === "dkk") {
    return [1, null];
  }
  const response = await fetch('https://www.floatrates.com/daily/dkk.json');
  const data = await response.json();
  if (!data[valuta.toLowerCase()]) {
    return [0, Error("Jeg kunne ikke finde vekselkursen for " + valuta + ".")];
  }
  let result = data[valuta.toLowerCase()].inverseRate;
  return [result, null];
}