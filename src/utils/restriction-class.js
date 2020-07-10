export function restrictionClass(restriction_trend) {
	if (!restriction_trend) {
		return "state--never-imposed";
	}
	return `state--${restriction_trend.replace(/ /g, "-")}`;
}
