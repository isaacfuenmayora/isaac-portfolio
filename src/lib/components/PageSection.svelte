<script lang="ts">
	import type { PaletteName } from '$lib/data/site';
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		palette: PaletteName;
		children: Snippet;
	}

	let { id, palette, children }: Props = $props();
</script>

<section {id} class="use-theme-background" data-palette={palette}>
	{@render children()}
</section>

<style>
	section {
		min-height: 100svh;
		padding-bottom: calc(2 * var(--nav-height));
		padding-bottom: calc(clamp(3.25rem, 8vw, 6rem) + var(--nav-height));
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
