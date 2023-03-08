
export const stringContainsAny = (/** @type {string} */ string, /** @type {string[]} */ chars) => chars.some((char) => string.includes(char))