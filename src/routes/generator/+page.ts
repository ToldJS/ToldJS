import type { PageLoad } from "./$types";

export const load: PageLoad = (async ({ fetch }) => {
  const response = await fetch('https://openexchangerates.org/api/currencies.json');
  const data = await response.json();
  return { currencies: data };
});