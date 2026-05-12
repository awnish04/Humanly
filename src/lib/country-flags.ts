/**
 * Country Flag Utilities
 * Get flag emoji for country codes
 */

export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode === "XX" || countryCode === "Unknown") {
    return "🌍"; // Globe emoji for unknown
  }

  // Convert country code to flag emoji
  // Flag emojis are created using Regional Indicator Symbols
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

export function getCountryName(country: string, countryCode: string): string {
  if (country === "Unknown") {
    return "Unknown Location";
  }
  return country;
}
