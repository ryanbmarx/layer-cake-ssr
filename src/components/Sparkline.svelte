<script>
    import { LayerCake, ScaledSvg } from 'layercake';
    import Line from './charts/Line.svelte';

    const points = [
    {x: 0, y: 0},
    {x: 5, y: 10},
    {x: 10, y: 20},
    {x: 15, y: 30},
    {x: 20, y: 400}
  ];
</script>

<style>
  .chart-container {
		background: yellow;
		margin: 1em 0;
        height: 100px;
	}

</style>
<div class="chart-container">
<!-- X and Y are the keys from the data to use -->
  <LayerCake     
    ssr={true}
    percentRange={true}
    x='x'
    y='y'
    data={points}>
      <ScaledSvg>
        <Line></Line>
      </ScaledSvg>
    </LayerCake>
</div>