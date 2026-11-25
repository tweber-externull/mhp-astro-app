export interface Event {
	id: number;
	event_name: string;
	start_date?: string;
}

function hasStartDate(
	event: Event,
): event is Event & { start_date: string } {
	return Boolean(event?.start_date);
}

export function isOutdated(date: string, now = new Date()) {
	const today = new Date(now);
	today.setMinutes(today.getMinutes() + today.getTimezoneOffset());

	const eventDate = new Date(date);
	eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset());

	return today > eventDate;
}

export function sortEventsByDate(events: Event[]) {
	return events.filter(hasStartDate).sort((a, b) => {
		const aDate = new Date(a.start_date);
		const bDate = new Date(b.start_date);

		return aDate.getTime() - bDate.getTime();
	});
}
