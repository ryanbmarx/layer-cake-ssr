<script>
	export let availableData = [];
	export let legendData = {};
	export let dataToShow = "";
	export let handleClick = () => {};
</script>

<style>
	.btn {
		--active-color: #ccc;
		--btn-padding: 16px;
		display: block;
		width: 100%;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		position: relative;
		margin: 0 0 16px 0;
		padding: 0;
	}

	.btn:hover,
	.btn:focus {
		outline: none;
	}

	.btn:hover .btn__inner,
	.btn:focus .btn__inner {
		background-color: var(--active-color, #ccc);
	}

	.btn__inner {
		position: relative;
		z-index: 2;
		padding: var(--btn-padding, 16px);
		background: #eee;
		transition: background-color var(--transition-speed) ease;
	}
	.btn::after {
		content: "";
		display: block;
		background-color: var(--active-color, #ccc);
		height: 30px;
		width: var(--btn-padding, 16px);

		position: absolute;
		top: 50%;
		right: 100%;
		transform: translate(100%, -50%);
		opacity: 0;
		clip-path: polygon(0 50%, 100% 0, 100% 100%);

		transition: transform var(--transition-speed) ease,
			background-color var(--transition-speed) ease,
			opacity var(--transition-speed) ease;
	}
	.btn--active .btn__inner {
		background-color: var(--active-color, #ccc);
	}
	.btn--active::after {
		transform: translate(0, -50%);
		opacity: 1;
	}
	.btn__label {
		font: bold 16px/1.3em var(--fonts-sans-serif);
		margin: 0 0 8px;
	}

	.btn__sublabel {
		margin: 0;
		font: 14px/1.3em var(--fonts-sans-serif);
	}

	.toggle-nav__label {
		margin: 0 0 1em 0;
		font: 14px/1em var(--fonts-sans-serif, sans-serif);
	}
</style>

<nav class="toggle-nav">
	<p class="toggle-nav__label">Show the data:</p>
	{#each availableData as d}
		<button
			class="btn"
			on:click={function(e) {
				handleClick(e, this);
			}}
			class:btn--active={dataToShow === d}
			data-to-show={d}>
			<div class="btn__inner">
				<p class="btn__label">{legendData[d].label}</p>
				<p class="btn__sublabel">{legendData[d].sublabel}</p>
			</div>
		</button>
	{/each}
</nav>
