export default function fetchImg(path: string, fallback: string): string {
  let url = "";
  try {
    url = require(`@/assets/img/${path}`);
  } catch (e) {
    url = require(`@/assets/img/${fallback}`);
  }
  return url;
}
