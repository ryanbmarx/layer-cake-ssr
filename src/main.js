import App from "./App.svelte";
import data from "./content/data.json";
const app = new App({
  hydrate: true,
  target: document.getElementById("covid-map-reopening-america"),
  props: data,
});

export default app;
