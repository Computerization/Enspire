export function cleanHTML(content: string): string

// Define
export function cleanHTML(content: string): string {
  if (!content) {
    return '';
  }

  return content.replace(/<script[^>]*>([\s\S]*?)<\/script>/gmi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gmi, '')
}
