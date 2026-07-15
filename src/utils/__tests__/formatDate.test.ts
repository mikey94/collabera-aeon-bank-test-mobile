import { describe, expect, it } from "@jest/globals";
import { formatDate, formatDateTime } from "../formatDate";

describe("formatDate", () => {
  it('formats an ISO date string as "d MMM yyyy"', () => {
    expect(formatDate("2024-10-15T12:34:56Z")).toBe("15 Oct 2024");
  });
});

describe("formatDateTime", () => {
  it("formats an ISO date string with time", () => {
    expect(formatDateTime("2024-10-15T12:34:56Z")).toMatch(
      /^15 Oct 2024, \d{2}:\d{2}$/,
    );
  });
});
