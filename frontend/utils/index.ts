export function removeUrls(text: string) {
  // This regex pattern finds URLs starting with http(s):// and removes them
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.replace(urlRegex, "");
}
