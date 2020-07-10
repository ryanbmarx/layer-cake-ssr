<script>
	import { onMount } from "svelte";
	let clickVerb = "Tap";

	export let toggled = false;
	export let label = "";
	export let sublabel = "";
	export let buckets = [];
	export let dataToShow = "";

	onMount(() => {
		clickVerb =
			"ontouchstart" in window || navigator.msMaxTouchPoints ? "Tap" : "Click";
	});
</script>

<style>
	.legend {
		font-family: var(--fonts-sans-serif);
		font-size: 14px;
		margin: 0 0 32px 0;
		box-sizing: border-box;

		/* Unlike the map, we only want one row */
		grid-template-rows: 1fr;
	}

	.legend__inner {
		grid-column: 1/-1;
	}

	.legend__label {
		font: bold 22px/1.3em var(--fonts-sans-serif);
		text-align: left;
		margin: 0;
	}

	.legend__sublabel {
		font: 16px/1.3em var(--fonts-sans-serif);
		margin: 0 0 16px 0;
		text-align: left;
	}

	.legend--toggled .legend__label {
		font-size: 18px;
	}
	.legend--toggled .legend__sublabel {
		font-size: 14px;
	}

	.legend__buckets {
		margin: 8px 0 0 0;
		padding: 0;
		list-style: none;

		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 0.5em;
	}

	.legend__bucket {
		display: flex;
		align-items: flex-start;
	}

	.swatch {
		background-color: #ddd;
		box-sizing: border-box;
		display: block;
		flex-shrink: 0;
		height: 14px;
		margin-right: 6px;
		width: 14px;

		margin-top: 2px;
	}

	/* MOBILITY BUCKETS */
	.legend__bucket--mobility-more .swatch {
		background-color: var(--color-mobility-growing);
	}

	.legend__bucket--mobility-less .swatch {
		background-color: var(--color-mobility-shrinking);
	}

	.legend__bucket--mobility-steady .swatch {
		background-color: var(--color-mobility-steady);
	}
	/* CASES BUCKETS */

	.legend__bucket--caseload-growing .swatch {
		background-color: var(--color-cases-growing);
	}

	.legend__bucket--caseload-shrinking .swatch {
		background-color: var(--color-cases-shrinking);
	}

	.legend__bucket--caseload-steady .swatch {
		background-color: var(--color-cases-steady);
	}

	/* RESTRICTIONS BUCKETS */

	.legend__bucket--restrictions-easing .swatch {
		background-color: var(--color-easing);
	}

	.legend__bucket--restrictions-tightening .swatch {
		background-color: var(--color-tightening);
	}

	.legend__bucket--restrictions-lifted .swatch {
		background-color: var(--color-lifted);
	}

	.legend__bucket--restrictions-no-recent-change .swatch {
		background-color: var(--color-no-recent-change);
	}

	.legend__bucket--restrictions-paused .swatch {
		background-color: var(--color-paused);
	}

	.swatch.never-imposed {
		background-color: var(--color-never-imposed);
		border: 1px solid #aaa;
	}

	@media all and (min-width: 500px) {
		.legend {
			margin-bottom: -35px;
		}

		.legend__inner {
			grid-column: 3/11;
			/* Just a little padding to force wordwrap before text bumps up against the map. */
			padding: 0 0 0.5em 0;
		}
	}
	@media (min-width: 768px) {
		.legend {
			margin-bottom: -60px;
		}

		.swatch {
			height: 16px;
			width: 16px;
			margin-top: 1px;
		}
	}
</style>

{#if buckets}
	<!-- svelte-ignore a11y -->
	<figcaption class="legend map-grid" class:legend--toggled={toggled}>
		<div class="legend__inner">
			<p class="legend__label">{label}</p>
			{#if sublabel}
				<p class="legend__sublabel">{sublabel}</p>
			{/if}
			<ul class="legend__buckets">
				{#each buckets as bucket (bucket.value)}
					<li class="legend__bucket legend__bucket--{dataToShow}-{bucket.value}">
						<span class="swatch " />
						{bucket.label}
					</li>
				{/each}
			</ul>
		</div>
	</figcaption>
{/if}
