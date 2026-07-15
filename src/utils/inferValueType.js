/**
 * Converts the user's input into the most appropriate JavaScript type.
 *
 * Rules:
 * 25      -> 25 (integer)
 * 10.5    -> 10.5 (number)
 * true    -> true (boolean)
 * FALSE   -> false (boolean)
 * abc     -> "abc" (string)
 * 025     -> "025" (string, preserve leading zero)
 * 001.5   -> "001.5" (string)
 * ""      -> ""
 */

export function inferValueType(value) {
  if (typeof value !== "string") {
    return value;
  }

  const input = value.trim();

  // Empty string
  if (input === "") {
    return "";
  }

  // Boolean
  if (/^true$/i.test(input)) {
    return true;
  }

  if (/^false$/i.test(input)) {
    return false;
  }

  // Integer (prevent numbers with leading zeros like 025)
  if (/^-?(0|[1-9]\d*)$/.test(input)) {
    return Number(input);
  }

  // Decimal (prevent 001.5)
  if (/^-?(0|[1-9]\d*)\.\d+$/.test(input)) {
    return Number(input);
  }

  // Everything else remains a string
  return value;
}
