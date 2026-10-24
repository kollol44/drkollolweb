/**
 * Utility functions for internationalization and digit/number conversions
 * between English (0-9) and Bengali (০-৯).
 */

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts Western digits (0-9) in any string to Bengali numerals (০-৯).
 */
export function toBengaliDigits(str: string | number): string {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[0-9]/g, (digit) => BN_DIGITS[parseInt(digit, 10)]);
}

/**
 * Converts Bengali numerals (০-৯) in any string to Western digits (0-9).
 */
export function toEnglishDigits(str: string | number): string {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[০-৯]/g, (digit) => String(BN_DIGITS.indexOf(digit)));
}

/**
 * Formats any string/number into the appropriate script based on `isBn`.
 * If isBn is true -> Bengali digits (০-৯)
 * If isBn is false -> English digits (0-9)
 */
export function formatDigits(str: string | number, isBn: boolean): string {
  return isBn ? toBengaliDigits(str) : toEnglishDigits(str);
}
