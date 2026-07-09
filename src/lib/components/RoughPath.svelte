<script lang="ts">
	import { createRoughSketch, type RoughSketchOptions } from '$lib/utils/roughSketch';

	interface Props extends RoughSketchOptions {
		d: string | string[];
		viewBox?: string;
		width?: number | string;
		height?: number | string;
	}

	let { d, width, height, viewBox, ...roughSketchOptions }: Props = $props();
	let container: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!container) return;
		createRoughSketch(container, roughSketchOptions, ({ rc, svg, roughOptions }) => {
			if (viewBox) {
				svg.setAttribute('viewBox', viewBox);
			}
			const paths = Array.isArray(d) ? d : [d];
			return paths.map((pathD) => rc.path(pathD, { fill: 'none', ...roughOptions }));
		});
	});
</script>

<div bind:this={container} style:width style:height></div>
