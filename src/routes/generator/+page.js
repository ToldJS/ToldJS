export const load = (async ({ fetch }) => {
  const response = await fetch('https://openexchangerates.org/api/currencies.json');
  const data = await response.json();
  return data;
});