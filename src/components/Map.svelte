<script>
	import { createEventDispatcher } from "svelte";
	import { restrictionClass } from "../utils/restriction-class";

	import USMap from "./USMap.svelte";
	import Legend from "./Legend.svelte";
	import State from "./State.svelte";

	export let data = [];
	export let updates;
	export let legendData = {};
	export let dataToShow = "";
	export let visible = false;
	export let toggled = false;

	const dispatch = createEventDispatcher();

	let states = data.sort((a, b) => {
		return parseInt(a.display_order) - parseInt(b.display_order);
	});

	function findUpdate(postal) {
		for (let i = 0; i < updates.length; i++) {
			if (updates[i].dataset.postal === postal) return updates[i];
		}
		return null;
	}

	function handleStateClick(e, state) {
		const update = findUpdate(state.postal);
		const modalContent = update.innerHTML;
		dispatch("modal:open", modalContent);
	}

	function getTrend(state) {
		switch (dataToShow) {
			case "restrictions":
				return restrictionClass(state.restriction_trend);
			case "caseload":
				return `state--caseload-${state.caseload}`;
			case "mobility":
				return `state--mobility-${state.mobility.trend}`;
		}
	}
</script>

<style>
	:global(.map-grid) {
		/* This is a global style so the grid used for the map can 
		be the same as the grid used in the legend. Now we easily can align them.
		*/
		display: grid;
		grid-gap: 2px;
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: 1fr;
		padding: 0;
	}
	.map {
		margin: 0;
		display: none;
		position: relative;
	}

	.map.map--visible {
		display: block;
	}
	.map-background {
		pointer-events: none;
		position: absolute;
		top: 64%;
		transform: translateY(-50%);
		width: 100%;
		z-index: 1;
	}
	.map-background :global(svg) {
		fill: #1665cf;
		fill-opacity: 0.05;
		stroke: #1665cf;
		stroke-width: 0.5;
		width: 100%;
	}
	.grid-container {
		/* display: grid; */
		/* grid-gap: 2px; */
		/* grid-template-columns: repeat(12, 1fr); */
		grid-template-rows: repeat(9, 1fr);
		position: relative;
		z-index: 2;
	}
	.one-to-one-aspect-ratio:after {
		content: "";
		display: inline-block;
		height: 0;
		padding-top: 100%;
		position: relative;
		width: 1px;
	}

	@media screen and (min-width: 768px) {
		.map-background {
			top: 50%;
		}

		:global(.map-grid) {
			padding: 0 20px;
		}
	}
</style>

<figure class:map--visible={visible} class="map map--{dataToShow}">
	<Legend {...legendData} {toggled} {dataToShow} />
	<div class="map-background">
		<USMap />
	</div>
	<div class="grid-container map-grid one-to-one-aspect-ratio">
		{#each states as state}
			<State
				trend={getTrend(state)}
				{state}
				on:click={e => {
					handleStateClick(e, state);
				}} />
		{/each}
	</div>
</figure>
