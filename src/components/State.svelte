<script>
	// import { createEventDispatcher } from "svelte";
	import { restrictionClass } from "../utils/restriction-class";

	export let trend;
	export let state = {};

	let postal = state.postal;
	let eased_restrictions = state.eased_restrictions;

	// function handleStateClick(e, postal) {
	// 	const update = findUpdate(postal);
	// 	const modalContent = update.innerHTML;
	// 	dispatch("modal:open", modalContent);
	// }
</script>

<style>
	.state {
		align-items: center;
		box-sizing: border-box;
		color: #fff;
		cursor: default !important;
		display: flex;
		height: 100%;
		justify-content: center;
		overflow: hidden;
		position: relative;
		text-decoration: none;
		width: 100%;
	}

	.state--eased {
		border-color: var(--color-eased);
	}

	.state.state--recent::after {
		content: "";
		border: 8px solid transparent;
		border-bottom-color: #000;
		display: block;
		position: absolute;
		transform: rotate(45deg);
		top: -7px;
		right: -7px;
	}

	.state.active {
		background-color: #1665cf;
		cursor: pointer;
	}
	.state:hover {
		cursor: pointer !important;
	}

	.state--ME {
		grid-column: 12;
	}
	.state--VT {
		grid-column: 11;
	}
	.state--WA,
	.state--OR,
	.state--CA {
		grid-column: 2;
	}
	.state--AZ {
		grid-column: 3;
	}
	.state--OK,
	.state--TX {
		grid-column: 5;
	}

	.state--HI {
		grid-column: 1;
	}
	.state--FL {
		grid-column: 10;
	}
	.state--PR {
		grid-column: 12;
		grid-row: 9;
	}

	.state label {
		color: #fff;
		cursor: pointer;
		font-family: sans-serif;
		font-size: 11px;
		font-weight: bold;
		position: relative;
		right: 1px;
		top: 2px;
	}

	.state--never-imposed {
		background-color: var(--color-never-imposed);
		border: 1px solid #aaa;
	}
	.state--unchanged,
	.state--no-recent-change {
		background-color: var(--color-no-recent-change);
	}

	.state--lifted {
		background-color: var(--color-lifted);
	}
	.state--easing {
		background-color: var(--color-easing);
	}
	.state--never-imposed label,
	.state--no-recent-change label {
		color: #333;
	}
	.state--tightening {
		background-color: var(--color-tightening);
	}
	.state--paused {
		background-color: var(--color-paused);
		color: #333;
	}
	.state--paused label {
		color: #333;
	}

	/* CASELOAD BUCKETS */
	:global(.state.state--caseload-growing) {
		background: var(--color-cases-growing);
	}

	:global(.state.state--caseload-steady) {
		background: var(--color-cases-steady);
	}

	:global(.state.state--caseload-shrinking) {
		background: var(--color-cases-shrinking);
	}

	/* MOBILTY BUCKETS */
	:global(.state.state--mobility-more) {
		background: var(--color-mobility-growing);
	}

	:global(.state.state--mobility-steady) {
		background: var(--color-mobility-steady);
	}

	:global(.state.state--mobility-less) {
		background: var(--color-mobility-shrinking);
	}

	@media screen and (min-width: 768px) {
		.state.state--recent::after {
			border-width: 10px;
			top: -9px;
			right: -9px;
		}
		.state label {
			font-size: 12px;
			top: 0px;
		}
	}
</style>

<a
	class="state state--{postal}
	{trend}"
	class:state--eased={eased_restrictions === 'Yes'}
	on:click|preventDefault
	href="#{postal.toLowerCase()}-update"
	aria-labelledby="{postal}-label">
	<label id="{postal}-label">{postal}</label>
</a>
