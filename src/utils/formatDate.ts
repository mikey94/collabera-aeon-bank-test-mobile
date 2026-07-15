import { format, parseISO } from "date-fns";

// "2024-10-15T12:34:56Z" -> "15 Oct 2024"
export function formatDate(isoDate: string): string {
  return format(parseISO(isoDate), "d MMM yyyy");
}

// "2024-10-15T12:34:56Z" -> "15 Oct 2024, 12:34"
export function formatDateTime(isoDate: string): string {
  return format(parseISO(isoDate), "d MMM yyyy, HH:mm");
}
