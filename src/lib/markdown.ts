import { marked } from "marked";

export async function parseMarkdownSafe(markdown: string): Promise<string> {
  const { default: DOMPurify } = await import("isomorphic-dompurify");
  const html = marked.parse(markdown) as string;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'hr', 'table',
      'thead', 'tbody', 'tr', 'th', 'td', 'img', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
  });
}