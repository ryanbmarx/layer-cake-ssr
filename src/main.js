import App from "./App.svelte";
import data from "./content/data.json";

const app = new App({
	hydrate: true,
	target: document.getElementById(process.env.PROJECT_SLUG),
	props: data,
});

export default app;
