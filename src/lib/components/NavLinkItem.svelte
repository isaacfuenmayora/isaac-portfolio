<script lang="ts">
	import type { NavLink } from '$lib/data/site';
	import MarkerFill from './MarkerFill.svelte';

	interface Props {
		link: NavLink;
		className?: string;
		[key: string]: unknown;
	}

	let { link, className = '', ...rest }: Props = $props();
</script>

<MarkerFill color="var(--theme-marker-3)" opacity={0.5} spacing={0.3}>
	<a
		href={link.href}
		target={link.external ? '_blank' : undefined}
		rel={link.external ? 'noreferrer' : undefined}
		class={className}
		{...rest}
	>
		{link.label}
	</a>
</MarkerFill>

<style>
	a:hover {
		/* TODO: add hover/focus styles */
		/* TODO: consider different bolder font */
		font-weight: bold;
	}
</style>
