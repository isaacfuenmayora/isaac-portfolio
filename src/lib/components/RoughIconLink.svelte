<script lang="ts">
	import RoughPath from './RoughPath.svelte';
	import { ICON_PATHS, type IconName } from '$lib/data/icons';
	import type { RoughSketchOptions } from '$lib/utils/roughSketch';

	interface Props extends RoughSketchOptions {
		href: string;
		icon: IconName;
		label?: string;
		size?: string;
		viewBox?: string;
		className?: string;
	}

	let {
		href,
		icon,
		label,
		size = '30px',
		strokeWidth = 7.5,
		roughness = 2.5,
		fill = 'black',
		hachureGap = 8,
		redrawOnHover = true,
		viewBox = '0 0 256 256',
		className = '',
		...rest
	}: Props = $props();
</script>

<a {href} target="_blank" rel="noreferrer" aria-label={label ?? icon} class={className}>
	<RoughPath
		width={size}
		height={size}
		{viewBox}
		{strokeWidth}
		{roughness}
		d={ICON_PATHS[icon]}
		{redrawOnHover}
		{fill}
		{hachureGap}
		{...rest}
	/>
</a>
