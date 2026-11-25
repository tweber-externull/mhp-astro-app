function getLocalizedDate(eventDate: string) {
	const date = new Date(eventDate);
	const timezoneOffset = date.getTimezoneOffset();
	date.setMinutes(date.getMinutes() + timezoneOffset);
	return date;
}

export function getWeekdayName(eventDate: string) {
	return getLocalizedDate(eventDate).toLocaleDateString("en-US", {
		weekday: "long",
	});
}

export function getMonthAndDate(eventDate: string) {
	return getLocalizedDate(eventDate).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});
}
