/**
 * Take an id such as "fancyId" and returns the pretty version of it:
 * "Fancy id"
 */
export function prettyName(id: string) {
  if (!id) return "";

  let formatted = id[0].toUpperCase();

  for (const char of id.slice(1)) {
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      formatted += " " + char.toLowerCase();
    } else {
      formatted += char;
    }
  }

  return formatted;
}
