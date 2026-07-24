/**Joins an array of strings into a single string separated by the provided separator. */
export function joinStrings(strings: string[], separator: string = ' ') {
  return strings.join(separator).trim();
}
