import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export function parseMarkdownSafe(markdown: string): string {
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