// src/lib/utils.ts

/**
 * Format a date string to Greek locale
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    dateStyle: "full",
    timeStyle: "short",
  };
  
  return new Intl.DateTimeFormat("el-GR", options || defaultOptions).format(
    new Date(dateString)
  );
}

/**
 * Format date for list views (shorter format)
 */
export function formatDateShort(dateString: string): string {
  return formatDate(dateString, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format date for compact views (no year unless different)
 */
export function formatDateCompact(dateString: string): string {
  return formatDate(dateString, {
    day: "numeric",
    month: "long",
  });
}

/**
 * Get contrast color for a background hex color
 */
export function getContrastColor(hexcolor: string): "black" | "white" {
  // Remove # if present
  const hex = hexcolor.replace('#', '');
  
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}