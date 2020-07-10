import marked from "marked";

/**
 * Renders a stirng of text as markdown (which includes straight-up HTML). As a utility,
 * forces all anchor links to open in a new window and adds the proper rels.
 *
 * @param {string} txt A string of text, potentially with markdown or HTML
 */

export function processText(txt) {
	let processsedText = marked(txt);
	processsedText = makeLinksNewWindow(processsedText);
	return processsedText;
}

function makeLinksNewWindow(txt) {
	if (typeof window === "undefined") return txt;

	const parser = new DOMParser();
	const doc = parser.parseFromString(txt, "text/html");
	const links = doc.querySelectorAll("a");
	for (let link of links) {
		let rel = link.getAttribute("rel") || "";
		if (rel.indexOf("noopener") < 0) rel += " noopener";
		if (rel.indexOf("noreferrer") < 0) rel += " noreferrer";
		link.setAttribute("rel", rel.trim());
		link.setAttribute("target", "_blank");
	}
	return doc.body.innerHTML;
}

export function floatFormat(num, { maximumFractionDigits = 2 } = {}) {
	return Number(num).toLocaleString("en-us", { maximumFractionDigits });
}
