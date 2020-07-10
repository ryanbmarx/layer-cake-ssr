import { AP_MONTHS } from "journalize/src/apmonth.js";

export function formatDate(datestring) {
	const date = new Date(datestring);
	const day = date.getUTCDate();
	const month = AP_MONTHS[date.getUTCMonth()];
	const year = date.getUTCFullYear();

	return `${month} ${day}, ${year}`;
}
