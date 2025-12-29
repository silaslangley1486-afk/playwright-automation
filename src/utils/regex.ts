// This regex handles optional commas and ensures exactly two decimal places for USD:
// ^\$\d{1,3}(,\d{3})*(\.\d{2})?$
// Note: Escaped slashes are needed in JS strings for some regex characters.
export const currencyRegex = /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/;
