<script>

	// Utils, etc.
	import { onMount } from "svelte";
	import * as analytics from "./utils/analytics";
	import { formatDate } from "./utils/format-date";
	import { processText, floatFormat } from "./utils/process-text";
	import { restrictionClass } from "./utils/restriction-class";

	// Components
	// import Modal from "./components/Modal.svelte";
	// import Map from "./components/Map.svelte";
	// import SocialShare from "./components/SocialShare.svelte";
	// import Dots from "./icons/Dots.svelte";
	// import ToggleNav from "./components/ToggleNav.svelte";
	import Sparkline from "./components/Sparkline.svelte";

	export let states = [];
	export let buckets = {};


	// Handling responsive designs ... this is the break between stacked maps and the toggle nav
	let toggleMinWidth = "768px";
	let toggleMatch;
	$: shouldToggle = toggleMatch ? toggleMatch.matches : false;

	let updates = [];
	let sortBy = "";
	let dataToShow = "caseload";

	$: sortedStates = states.sort((a, b) => {
		if (sortBy == "state") {
			return a.state < b.state ? -1 : 1;
		}
		if (!a.last_update || !b.last_update) return 1;
		return new Date(a.last_update) < new Date(b.last_update) ? 1 : -1;
	});

	$: sortByLabel = sortBy == "state" ? "State, A-Z" : "Latest update";

	onMount(() => {
		sortBy = "last_update";
		if (window !== undefined) {
			// Init our media watcher
			toggleMatch = window.matchMedia(`(min-width: ${toggleMinWidth})`);
			toggleMatch.addListener(function(e) {
				shouldToggle = this.matches;
			});
		}
	});

	function updateHeadline(st) {
		const headlineMap = {
			easing: "Restrictions are easing in",
			"never imposed": "Restrictions were never imposed in",
			lifted: "Restrictions have been lifted in",
			tightening: "Restrictions were imposed in",
			unchanged: "Restrictions are unchanged in",
			paused: "A plan to reopen has been paused in",
		};
		if (!st.restriction_trend) {
			return `No change in ${st.state}`;
		}
		return `${headlineMap[st.restriction_trend]} ${st.state}`;
	}

	function closureStatus(st) {
		if (!st.stay_at_home_start) {
			return "Never issued";
		}
		const started = new Date(st.stay_at_home_start);
		if (!st.stay_at_home_end) {
			return `Started ${formatDate(st.stay_at_home_start)}`;
		}
		const end = new Date(st.stay_at_home_end);
		const endVerb = end < new Date() ? "ended" : "ending";
		return `Started ${formatDate(st.stay_at_home_start)}; ${endVerb} on ${formatDate(
			st.stay_at_home_end
		)}`;
	}

	function bucketsForState(st) {
		const bux = st.eased_buckets
			.replace(/ +/, "")
			.split(",")
			.reduce((b, code) => {
				if (buckets.hasOwnProperty(code)) {
					b.push(buckets[code]);
				}
				return b;
			}, []);
		return bux.join(", ");
	}
</script>

<style>
	/**
	 * Color-blind friendly map color pallette
	 * Source: https://thenode.biologists.com/data-visualization-with-flying-colors/research/
	 *	 
	 * "never imposed": white with gray border
	 * "lifted": green #1e7826
	 * "easing": blue #366299
	 * "tightening": dark magenta #971d64
	 * "no recent change": light gray #adadad
	 */

	:global(html body) {
		--bucket-white: white;
		--bucket-green: #1e7826;
		--bucket-blue: #366299;
		--bucket-dark-magenta: #971d64;
		--bucket-gray: #adadad;
		--bucket-yellow: #f7fcb9;

		/* restrictions buckets */
		--color-never-imposed: var(--bucket-white, white);
		--color-no-recent-change: var(--bucket-gray, #adadad);
		--color-lifted: var(--bucket-green, #1e7826);
		--color-easing: var(--bucket-blue, #366299);
		--color-tightening: var(--bucket-dark-magenta, #971d64);
		--color-paused: var(--bucket-yellow, #f7fcb9);

		/* caseload buckets */
		--color-cases-growing: var(--dark-magenta, #971d64);
		--color-cases-steady: var(--bucket-gray, #adadad);
		--color-cases-shrinking: var(--bucket-blue, #366299);

		/* MOBILITY buckets TK */
		--color-mobility-growing: var(--dark-magenta, #971d64);
		--color-mobility-steady: var(--bucket-gray, #adadad);
		--color-mobility-shrinking: var(--bucket-blue, #366299);

		--color-update: yellow;
		--transition-speed: 200ms;
		--fonts-sans-serif: "Unify Sans", "Helvetica", "Arial", sans-serif;
		--theme-color: #1665cf;
		--nav-height: 56px;

		background: #fff;
	}
	.reopening :global(.section) {
		max-width: 650px;
		margin: auto;
		padding: 0 20px;
	}
	.reopening .section__header {
		align-items: center;
		display: flex;
		justify-content: space-between;
		margin: 30px 0;
	}
	.reopening .section__headline {
		margin: 0;
	}

	.headline-container {
		position: relative;
	}

	.headline-container :global(.dots) {
		position: absolute;
		right: 100%;
		transform: translate(0.43em, 0);
	}
	.hammer {
		display: inline-block;
		font-size: 42px;
		font-family: var(--fonts-sans-serif, sans-serif);
		font-weight: bold;
		line-height: 1;
		margin-bottom: 12px;
		position: relative;
	}
	.headline {
		display: block;
		font-size: 24px;
		font-family: var(--fonts-serif, "Georgia", serif);
		font-style: italic;
		font-weight: bold;
		position: relative;
	}
	.headline:after {
		content: "";
		background-color: #b9e1ff;
		bottom: 2px;
		height: 10px;
		left: 0;
		position: absolute;
		width: 100%;
		z-index: -1;
	}
	.reopening :global(.top .last-update) {
		font-family: var(--fonts-sans-serif, sans-serif);
		font-size: 14px;
	}
	.reopening :global(.top p) {
		font-family: var(--serif, serif);
		font-size: 16px;
		line-height: 1.35;
	}
	.sort-control {
		align-items: center;
		display: flex;
		flex-direction: row;
	}
	.sort-control label {
		font-family: var(--fonts-sans-serif);
		font-size: 14px;
	}
	@media (max-width: 320px) {
		.sort-control label {
			display: none;
		}
	}
	.sort-select {
		position: relative;
	}
	.sort-select:after {
		border: 6px solid transparent;
		border-top-color: #aaa;
		border-top-width: 8px;
		content: "";
		display: block;
		position: absolute;
		right: 11px;
		top: calc(50% - 2px);
	}
	.sort-select label {
		border: 1px solid #aaa;
		border-radius: 3px;
		color: #606060;
		display: inline-block;
		font-size: 14px;
		margin-left: 8px;
		padding: 6px 8px;
		width: 115px;
	}
	.sort-select select {
		opacity: 0;
		position: absolute;
		height: 100%;
		left: 0;
		top: 0;
		width: 100%;
	}
	.sort-select select option {
		font-size: 16px;
	}
	.update {
		margin-bottom: 30px;
	}
	.update__headline {
		font-size: 24px;
		position: relative;
		text-indent: 24px;
	}
	.update__headline:before {
		background-color: gray;
		content: "";
		height: 18px;
		left: 0;
		position: absolute;
		top: 6px;
		width: 18px;
	}
	.update__headline.state--easing:before {
		background-color: var(--color-easing);
	}
	.update__headline.state--tightening:before {
		background-color: var(--color-tightening);
	}
	.update__headline.state--lifted:before {
		background-color: var(--color-lifted);
	}
	.update__headline.state--no-recent-change:before {
		background-color: var(--color-no-recent-change);
	}
	.update__date {
		font-style: italic;
	}
	.update p {
		font-size: 18px;
		line-height: 1.15;
	}
	.update--recent .update__date::before {
		content: "";
		display: block;
		width: 0.7em;
		height: 0.7em;
		border-radius: 50%;
		margin: 0 6px 0 0;
		background: var(--color-update);
		display: inline-block;
		border: 1px solid #999;
	}
	.update__state {
		font: bold 14px/1.3em var(--fonts-sans-serif);
		color: #888;
		display: block;
		margin-bottom: 8px;
		text-transform: uppercase;
	}
	:global(.update) .stay-at-home,
	:global(.update) .affected-sectors {
		font-family: var(--fonts-sans-serif);
		font-size: 15px;
	}
	.read-more {
		color: var(--theme-color, #1665cf);
		font-family: var(--fonts-sans-serif, sans-serif);
		font-size: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;

		overflow: hidden;
		max-width: 100%;
	}
	.update .read-more strong {
		color: #000 !important;
	}
	.update .read-more a {
		color: var(--theme-color, #1665cf);
	}

	#stories {
		margin-top: 30px;
	}

	.bg-screen {
		background: #f9f9f9;
		border: 1px solid #dce6f4;
	}

	.headline-container.bg-screen {
		border-top: none;
	}

	.maps {
		display: grid;
		grid-auto-flow: dense;
		grid-gap: 30px;
	}

	.maps.maps--toggle {
		grid-template-columns: 1fr 200px;
		max-width: 1080px;
	}

	.maps--toggle :global(.toggle-nav) {
		grid-column: 2;
	}

	.maps--toggle :global(.map-container) {
		grid-column: 1;
	}



	@media (min-width: 768px) {
		.reopening :global(.section.top) {
			max-width: 840px !important;
		}
		.reopening :global(.top p) {
			font-size: 18px;
		}
		.hammer {
			font-size: 60px;
			line-height: 1.4;
		}
		.headline {
			font-size: 24px;
			line-height: 1.4;
		}
		.update__headline {
			text-indent: 0;
		}
		.update__headline:before {
			left: -24px;
		}
	}
</style>

<div class="reopening" foo="bar">

	<section id="stories" class="bg-screen">
		<div class="section">
			<header class="section__header">
				<h2 class="section__headline">Updates</h2>
				<div class="sort-control">
					<label>Sort by</label>
					<div class="sort-select">
						<label>{sortByLabel}</label>
						<select bind:value={sortBy}>
							<option value="last_update">Latest update</option>
							<option value="state">State, A-Z</option>
						</select>
					</div>
				</div>
			</header>

			{#each sortedStates as st, i}
				<div
					id="{st.postal.toLowerCase()}-update"
					data-postal={st.postal}
					class="update"
					bind:this={updates[i]}>
					<label class="update__state">{st.state}</label>
					<h3 class="update__headline {restrictionClass(st.restriction_trend)}">
						{updateHeadline(st)}
					</h3>
					{#if st.last_update}
						<p class="update__date">Updated {formatDate(st.last_update)}</p>
					{/if}
					{#if st.copy}
						<p>{st.copy}</p>
					{:else}
						<p>No update available for {st.state}.</p>
					{/if}
					<p class="stay-at-home">
						<strong>Stay-at-home order:</strong>
						{closureStatus(st)}
					</p>
					{#if st.eased_buckets}
						<p class="affected-sectors">
							<strong>Affected sectors:</strong>
							{bucketsForState(st)}
						</p>
					{/if}
					{#if st.caseload_trend}
						<h4>Caseload</h4>
						<p class="affected-sectors">
							{@html st.caseload_trend}
						</p>
						<!-- DEBUG: This is the main LayerCake component -->
						<Sparkline></Sparkline>
					{/if}
					{#if st.mobilityString}
						<p class="affected-sectors">
							<strong>Mobility:</strong>
							{@html st.mobilityString}
						</p>
					{/if}
					{#if st.mobility && st.mobility.leave_home_7day_change}
						<p class="affected-sectors">
							<strong>Mobility:</strong>
							For the seven days ending {formatDate(st.mobility.latest_7day_date)}, the
							share of residents leaving their homes was about
							<strong>
								{floatFormat(Math.abs(st.mobility.leave_home_7day_change))}% {st.mobility.direction}
							</strong>
							than the seven days prior, data from SafeGraph show.
						</p>
					{/if}
					{#if st.caseloadAverage}
						<p class="affected-sectors">
							{@html st.caseloadAverage}
						</p>
					{/if}
					{#if st.read_more_url}
						<p class="read-more">
							<strong>Read more:</strong>
							<a href={st.read_more_url} target="_blank" rel="noreferrer noopener">
								{st.read_more_url}
							</a>
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</div>
