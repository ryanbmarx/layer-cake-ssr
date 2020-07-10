<script>
	export let title = "";
</script>

<svg
	class="dots"
	width="42"
	height="58"
	viewBox="0 0 42 58"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	role="img"
	aria-hidden="true">

	{#if title}
		<title>{title}</title>
	{/if}

	<style>
		.circle {
			fill: var(--theme-color, #009bff);
		}
	</style>
	<circle cx="1" cy="1" r="1" class="circle" />
	<circle cx="1" cy="9" r="1" class="circle" />
	<circle cx="1" cy="17" r="1" class="circle" />
	<circle cx="1" cy="25" r="1" class="circle" />
	<circle cx="1" cy="33" r="1" class="circle" />
	<path
		d="M2 41C2 41.5523 1.55228 42 1 42C0.447715 42 0 41.5523 0 41C0 40.4477 0.447715 40
		1 40C1.55228 40 2 40.4477 2 41Z"
		class="circle" />
	<circle cx="1" cy="49" r="1" class="circle" />
	<circle cx="1" cy="57" r="1" class="circle" />
	<circle cx="9" cy="1" r="1" class="circle" />
	<circle cx="17" cy="1" r="1" class="circle" />
	<circle cx="33" cy="1" r="1" class="circle" />
	<circle cx="25" cy="1" r="1" class="circle" />
	<circle cx="41" cy="1" r="1" class="circle" />
	<circle cx="9" cy="9" r="1" class="circle" />
	<circle cx="17" cy="9" r="1" class="circle" />
	<circle cx="33" cy="9" r="1" class="circle" />
	<circle cx="25" cy="9" r="1" class="circle" />
	<circle cx="41" cy="9" r="1" class="circle" />
	<circle cx="9" cy="17" r="1" class="circle" />
	<circle cx="17" cy="17" r="1" class="circle" />
	<circle cx="33" cy="17" r="1" class="circle" />
	<circle cx="25" cy="17" r="1" class="circle" />
	<circle cx="41" cy="17" r="1" class="circle" />
	<circle cx="9" cy="25" r="1" class="circle" />
	<circle cx="17" cy="25" r="1" class="circle" />
	<circle cx="33" cy="25" r="1" class="circle" />
	<circle cx="25" cy="25" r="1" class="circle" />
	<circle cx="41" cy="25" r="1" class="circle" />
	<circle cx="9" cy="33" r="1" class="circle" />
	<circle cx="9" cy="41" r="1" class="circle" />
	<circle cx="9" cy="49" r="1" class="circle" />
	<circle cx="9" cy="57" r="1" class="circle" />
	<circle cx="17" cy="33" r="1" class="circle" />
	<circle cx="33" cy="33" r="1" class="circle" />
	<circle cx="17" cy="41" r="1" class="circle" />
	<circle cx="33" cy="41" r="1" class="circle" />
	<circle cx="17" cy="49" r="1" class="circle" />
	<circle cx="33" cy="49" r="1" class="circle" />
	<circle cx="17" cy="57" r="1" class="circle" />
	<circle cx="33" cy="57" r="1" class="circle" />
	<circle cx="25" cy="33" r="1" class="circle" />
	<circle cx="41" cy="33" r="1" class="circle" />
	<circle cx="25" cy="41" r="1" class="circle" />
	<circle cx="41" cy="41" r="1" class="circle" />
	<circle cx="25" cy="49" r="1" class="circle" />
	<circle cx="41" cy="49" r="1" class="circle" />
	<circle cx="25" cy="57" r="1" class="circle" />
	<circle cx="41" cy="57" r="1" class="circle" />
</svg>
