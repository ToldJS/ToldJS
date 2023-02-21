import { getCurrencies } from '../lib/currencies.js';

export const load = (async () => {
  const data = await getCurrencies();
  return data;
});