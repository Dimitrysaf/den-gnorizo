import MarkdownIt from "markdown-it";

const parser = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
});

export function parseMarkdownSafe(markdown: string): string {
  if (!markdown) return "";
  return parser.render(markdown);
}