<script>
	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";
	import { fireEvent } from "../utils/analytics";

	let visible = false;
	export let modalContent = "";
	const ESCAPE = 27;

	export function open(content) {
		fireEvent(`storytelling-covid-map-reopening-america-modal-open`);
		modalContent = content;
		visible = true;
		lockBody();
		window.addEventListener("keyup", onKeyup);
	}

	function onKeyup(evt) {
		if (evt.keyCode == ESCAPE) {
			close(null);
		}
	}

	function closeOverlay(e) {
		if (e.target === this) {
			// This condition makes it only clicking on the overlay will close the modal
			close();
		}
	}

	function close() {
		visible = false;
		unlockBody();
		window.removeEventListener("keyup", onKeyup);
	}

	function lockBody() {
		document.querySelector("body").classList.add("locked");
	}

	function unlockBody() {
		document.querySelector("body").classList.remove("locked");
	}
</script>

<style>
	:global(body.locked) {
		overflow: hidden;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		z-index: 2;
	}

	.modal {
		z-index: 3;
		display: flex;
	}

	.modal__inner {
		box-sizing: border-box;
		padding: 30px;
		background: white;
		margin: auto;

		width: 100vw;
		max-width: 500px;

		position: relative;

		max-height: calc(100vh - var(--nav-height));
		margin-top: var(--nav-height);
		overflow: auto;
	}

	.modal__close {
		display: block;
		border: none;
		background: none;
		font-size: 20px;
		cursor: pointer;
		height: 44px;
		width: 44px;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;

		position: absolute;
		top: 0;
		right: 0;
	}

	@media all and (min-width: 768px) {
		.modal__inner {
			width: 90vw;
			max-height: 90vh;
			margin-top: auto;
		}
	}
</style>

{#if visible}

	<div class="modal" on:click={closeOverlay} transition:fade={{ duration: 200 }}>
		<div
			class="modal__inner update"
			in:fly={{ y: -50, duration: 200 }}
			out:fly={{ y: 50, duration: 200 }}>
			<button on:click={close} class="modal__close">&times;</button>
			{@html modalContent}
		</div>
	</div>
{/if}
