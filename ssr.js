#!/usr/bin/env node

require = require("esm")(module);
require("svelte/register");
const path = require("path");
const sander = require("sander");

const App = require("./src/App.svelte").default;
const { UW } = require("./src/utils/uw.js");

const PROJECT_SLUG = path.basename(process.cwd());
const GIT_BRANCH = process.env.GIT_BRANCH || "dev";
const CDN_ROOT =
	"https://www.gannett-cdn.com/usat-storytelling/storytelling-studio-apps";
const PROJECT_PATH = `${CDN_ROOT}/${GIT_BRANCH}/${PROJECT_SLUG}`;

const CANONICAL_URL =
	"https://www.usatoday.com/storytelling/coronavirus-reopening-america-map/";

module.exports = { render };

// render static html for embedding
async function render() {
	const seed = Date.now();
	const content = await sander
		.readFile(__dirname, "src/content/data.json")
		.then(JSON.parse);

	const { html } = App.render(content);

	const styles = [`${PROJECT_PATH}/bundle.css?c=${seed}`];
	const scripts = [`${PROJECT_PATH}/bundle.js?c=${seed}`];
	const shareImage = content.share_image || "";

	const sstsColon = content.ssts ? `ssts:${content.ssts.split("/").join(":")}` : "";
	const DATE_PUBLISHED = new Date(content.date_published);
	const DATE_MODIFIED = new Date();

	const jsonldMetadata = {
		contentSourceCode: "USAT",
		siteCode: "USAT",
		ssts: sstsColon,
		type: "story",
	};

	const jsonld = {
		"@context": "http://schema.org",
		"@type": "NewsArticle",
		author: {
			"@type": "Organization",
			name: "USA TODAY",
		},
		dateModified: DATE_MODIFIED,
		datePublished: DATE_PUBLISHED,
		headline: content.title,
		image: {
			"@type": "ImageObject",
			url: shareImage,
		},
		isBasedOn: CANONICAL_URL,
		keywords: ["type:story", sstsColon],
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": CANONICAL_URL,
		},
		metadata: JSON.stringify(jsonldMetadata),
		publisher: {
			"@type": "Organization",
			logo: {
				"@type": "ImageObject",
				height: 60,
				width: 338,
				url:
					"https://www.gannett-cdn.com/gannett-web/properties/usatoday/logos-and-branding/logo-amp-results.png",
			},
			name: "USA TODAY",
		},
	};

	return UW({
		title: content.title,
		description: content.deck,
		url: CANONICAL_URL,
		share_image: shareImage.toString(),
		share_text: content.share_text,
		scripts,
		styles,
		ssts: content.ssts,
		html: `<main id="${PROJECT_SLUG}">${html}</main>`,
		jsonld,
	});
}

if (require.main === module) {
	render()
		.catch(console.error)
		.then(uw => JSON.stringify(uw, null, 2))
		.then(console.log);
}
