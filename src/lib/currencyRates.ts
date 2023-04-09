
export async function getCurrencyRate(valuta: string): Promise<[number, Error | null]> {
  if (valuta.toLowerCase() === "dkk") {
    return [1, null];
  }
  const response = await fetch('https://www.floatrates.com/daily/dkk.json');
  const data = await response.json();
  if (!data[valuta.toLowerCase()]) {
    return [0, Error("Jeg kunne ikke finde vekselkursen for " + valuta + ".")];
  }
  const result = data[valuta.toLowerCase()].inverseRate;
  return [result, null];
}