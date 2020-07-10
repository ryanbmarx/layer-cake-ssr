const assert = require("assert");
const path = require("path");
const dates = require("date-fns");
const _ = require("lodash");

const Gootenberg = require("gootenberg");
const sander = require("sander");
const ssr = require("./ssr.js");

const fetch = require("node-fetch");
const groupBy = require("lodash.groupby");
const { format } = require("d3-format");
const { csvParse } = require("d3-dsv");
const { apnumber } = require("journalize");
// const { ro } = require("date-fns/locale");

// the directory we're in is our project slug, always
// if you need a different project URL, use UW config
const PROJECT_SLUG = path.basename(process.cwd());

const REQUIRED_ENVS = ["GAPI_CLIENT_EMAIL", "GAPI_PRIVATE_KEY"];

const OUTPUT_DIR = "./src/content";
const STATIC_DIR = "./src/static";

const GIT_BRANCH = process.env.GIT_BRANCH || "dev";
const CDN_ROOT =
	"https://www.gannett-cdn.com/usat-storytelling/storytelling-studio-apps";
const PROJECT_PATH = `${CDN_ROOT}/${GIT_BRANCH}/${PROJECT_SLUG}`;

// DATA LOCATIONS
const SPREADSHEET_KEY = "16ecYyRYjBBgsJZltL5STlfzg-bmI2XVFxqDAvF5YclI";

// MOBILITY spreadsheet: docs.google.com/spreadsheets/d/1HtuLAp71VgjplWDNINDLDhT9nVYRpBa9ki6vMsMNBOA/edit#gid=574822875
const MOBILITY_DATA_URL =
	"https://s3-us-west-2.amazonaws.com/apps.statesman.com/news/20200600-state-mobility/latest_metrics.csv";
const CASELOAD_DATA_URL =
	"https://www.gannett-cdn.com/experiments/usatoday/_data/covid-19/map-data/us_state_time_series.json";

const CASELOAD_DAYS = 7;

module.exports = {
	default: check,
	auth,
	data,
	uw,
};

async function check() {
	console.log("Checking configuration.");

	REQUIRED_ENVS.forEach(key => {
		assert(
			key in process.env,
			`${key} not found. Please check your .env and try again.`
		);
	});

	console.log("Good to gulp.");
}

async function auth() {
	const goot = new Gootenberg();
	await goot.auth.jwt();

	return goot;
}

async function data() {
	await check();

	// fetch data here
	const goot = await auth();

	const table = await goot.parse.table(SPREADSHEET_KEY);
	let data = {};

	// First, look for a top tab and handle that.
	if (table.top) {
		// Put the key/value pairs into our data container
		data = { ...kv(table.top) };
		// Remove the top from the source data, so we don't also
		// end up with the same content in data["top"]
		delete table.top;
	}

	// Merge map, text_content and read_more tables.
	const map = kvSheet(table.map, "postal");
	const textContent = kvSheet(table.text_content, "postal");
	const readMore = kvSheet(table.read_more, "postal");
	data.states = Object.keys(map).map(k => ({
		...map[k],
		...textContent[k],
		...readMore[k],
	}));

	data.buckets = kv(table._Buckets, "Code", "Definition");

	data = await getCaseload(data);
	// data = await getMobilityData(data);
	const mobility = await getMobility();
	data.states.forEach(row => {
		row.mobility = mobility[row.state];

		if (row.state === "D.C.") {
			row.mobility = mobility["District of Columbia"];
		}

		delete row.mobility.state;
	});

	return Promise.all([
		sander.writeFile(OUTPUT_DIR, "data.json", JSON.stringify({ ...data }, null, 2)),
	]);
}
/**
 * getWeeklyMobility downloads and parses mobility data
 * fields:
 *  - state
 *  - peak_leave_home_date
 *  - feb_mean_leave_home
 *  - peak_leave_home
 *  - latest_7day_date
 *  - leave_home_latest
 *  - leave_home_pct_of_feb
 *  - leave_home_7day_change
 */
async function getMobility() {
	const text = await fetch(MOBILITY_DATA_URL).then(r => r.text());
	const data = csvParse(text, row => ({
		state: row.state,
		peak_leave_home_date: new Date(row.peak_leave_home_date),
		peak_leave_home: +row.peak_leave_home,
		latest_7day_date: new Date(row.latest_7day_date),
		leave_home_latest: +row.leave_home_latest,
		leave_home_pct_of_feb: +row.leave_home_pct_of_feb,
		leave_home_7day_change: +row.leave_home_7day_change,
		direction: +row.leave_home_7day_change > 0 ? "more" : "less",
		trend: getMobilityTrend(+row.leave_home_7day_change),
	}));

	return data.reduce((m, row) => {
		m[row.state] = row;
		return m;
	}, {});
}

function getMobilityTrend(change) {
	let trend = "steady";
	if (change > 0.1) {
		trend = "more";
	} else if (change < -0.1) {
		trend = "less";
	}

	return trend;
}

/**
 *
 * getCaseload() fetches the daily caseload data and calculates, for each state, how many new cases for current two-week period versus the previous two-week period
 *
 * @param {object} sheetData This is the google sheet data from which all our content flows
 */
async function getCaseload(sheetData) {
	console.log("+++ Fetching case load data");

	// This function will format our numbers for human eyeballs
	const numberFormat = format(",");

	// Fetch the data for processing
	return fetch(CASELOAD_DATA_URL)
		.then(resp => resp.json())
		.then(d => {
			// Group the data by state
			d = groupBy(d, "province_state");

			// For each state ...
			for (let i = 0; i < sheetData.states.length; i++) {
				const s = sheetData.states[i];
				let state = s.state;

				// Match our labels for DC because they are different in each dataset
				if (state == "D.C.") state = "District of Columbia";

				/*
				`stateDate` is the data for each state. We will use confirmed cases. 
				Example data point: 

				{
					"date":"4/5/20",
					"province_state":"California",
					"confirmed":15034,
					"deaths":348
				}
				
				*/
				const stateData = d[state];

				// Now, we will calculate the number of new cases in the last CASELOAD_DAYS.
				// Current overall total - overall total from previous period.
				const latestTrend =
					parseInt(stateData[stateData.length - 1].confirmed) -
					parseInt(stateData[stateData.length - (CASELOAD_DAYS + 1)].confirmed);

				// Do the same thing for the period prior
				const agoTrend =
					parseInt(stateData[stateData.length - (CASELOAD_DAYS + 1)].confirmed) -
					parseInt(stateData[stateData.length - (CASELOAD_DAYS * 2 + 1)].confirmed);

				// Is that number larger, smaller, or the same as two weeks prior?
				let growthLabel = latestTrend > agoTrend ? "growing" : "shrinking";
				if (latestTrend === agoTrend) growthLabel = "steady";

				// Format numbers for human consumption
				const latestString = latestTrend < 1 ? "none" : numberFormat(latestTrend);
				const agoString = agoTrend < 1 ? "none" : numberFormat(agoTrend);

				// Format the date of the most recent data point for human consumption
				let latestDate = dates.format(
					new Date(stateData[stateData.length - 1].date),
					"MMMM d"
				);

				// Continue formatting the date of the most recent data point for editors who like AP style. :P
				latestDate
					.replace("January", "Jan.")
					.replace("February", "Feb.")
					.replace("August", "Aug.")
					.replace("September", "Sept.")
					.replace("October", "Oct.")
					.replace("November", "Nov.")
					.replace("December", "Dec.");

				// Write our sentence, describing the trend in this state/territory/district
				sheetData.states[i].caseload = growthLabel;
				sheetData.states[
					i
				].caseload_trend = `The number of confirmed new cases is <strong>${growthLabel}</strong>, with <strong>${latestString}</strong> for the ${apnumber(
					CASELOAD_DAYS
				)} days ending ${latestDate} compared to <strong>${agoString}</strong> the ${apnumber(
					CASELOAD_DAYS
				)} days prior.`;
			}
			return sheetData;
		});
}

async function uw() {
	const uw = await ssr.render();

	return sander.writeFile(
		"./public/uw",
		`${PROJECT_SLUG}.json`,
		JSON.stringify(uw, null, 2)
	);
}

// Takes a sheet form Goot and returns an array of the rows
// Automatically strips any column beginning with "_"
function filterFields(sheet) {
	return sheet.map(row => {
		// Strip all underscore-prefixed columns
		Object.keys(row).forEach(k => {
			if (k.indexOf("_") === 0) delete row[k];
		});
		return row;
	}, {});
}

// Takes a sheet from Goot and returns an object of k/v pairs
// Requires columns of "key" and "value"
function kv(arr, keyField = "key", valueField = "value") {
	return arr.reduce((m, row) => {
		m[row[keyField]] = row[valueField];
		return m;
	}, {});
}

// Takes a sheet from Goot and returns an object
// keyed to "key" and value an object of k/v pairs
function kvSheet(sheet, key) {
	if (!key) {
		return {};
	}
	return sheet.reduce((m, row) => {
		m[row[key]] = row;
		return m;
	}, {});
}
