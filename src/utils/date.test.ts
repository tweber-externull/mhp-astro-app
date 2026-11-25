import { describe, expect, it } from "vitest";
import { getMonthAndDate, getWeekdayName } from "./date";

describe("event date formatting", () => {
	it("formats the weekday for an event date", () => {
		expect(getWeekdayName("2026-08-30T12:00:00Z")).toBe("Sunday");
	});

	it("formats the month and day for an event date", () => {
		expect(getMonthAndDate("2026-08-30T12:00:00Z")).toBe("August 30");
	});
});
