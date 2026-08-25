import type { TimestampString } from "../_types/date";

function toDate(value: TimestampString): Date {
  return new Date(value);
}

function toMillis(value: TimestampString): number {
  return toDate(value).getTime();
}

function nowTimestamp(): TimestampString {
  return new Date().toISOString();
}

function formatDate(timestamp: TimestampString): string {
  const date = toDate(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatDateTime(timestamp: TimestampString): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(toDate(timestamp));
}

function formatShortDate(timestamp: TimestampString): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(toDate(timestamp));
}

function formatShortDateTime(timestamp: TimestampString): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(toDate(timestamp));
}

export {
  formatDate,
  formatDateTime,
  formatShortDate,
  formatShortDateTime,
  nowTimestamp,
  toDate,
  toMillis,
};
