import { describe, expect, it } from "vitest";
import { isOutdated, sortEventsByDate } from "./events";

describe("event helpers", () => {
	it("sorts dated events chronologically and excludes events without dates", () => {
		const events = [
			{ id: 1, event_name: "Later", start_date: "2026-08-30" },
			{ id: 2, event_name: "Undated" },
			{ id: 3, event_name: "Earlier", start_date: "2026-01-15" },
		];

		expect(sortEventsByDate(events).map((event) => event.id)).toEqual([3, 1]);
	});

	it("identifies events before now as outdated", () => {
		const now = new Date("2026-08-30T12:00:00Z");

		expect(isOutdated("2026-08-30T11:59:00Z", now)).toBe(true);
		expect(isOutdated("2026-08-30T12:01:00Z", now)).toBe(false);
	});
});
