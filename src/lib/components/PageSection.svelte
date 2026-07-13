<script lang="ts">
	import type { PaletteName } from '$lib/data/site';
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		palette: PaletteName;
		overline?: string;
		title?: string;
		children: Snippet;
	}

	let { id, palette, overline, title, children }: Props = $props();
</script>

<section {id} data-palette={palette}>
	{#if overline || title}
		<header>
			{#if overline}<p class="eyebrow">{overline}</p>{/if}
			{#if title}<h2 class="section-title">{title}</h2>{/if}
		</header>
	{/if}
	{@render children()}
</section>

<style>
	section {
		width: min(1120px, 100% - 2.5rem);
		margin-inline: auto;
		min-height: 100svh;
		padding-bottom: calc(clamp(3.25rem, 8vw, 6rem) + var(--nav-height));
		display: grid;
		gap: var(--space-6);
		align-content: center;
	}

	@media (max-width: 768px) {
		section {
			width: min(1120px, 100% - 1.25rem);
		}
	}

	.section-title {
		margin: 0.35rem 0 0;
		font-size: clamp(1.85rem, 3.2vw, 2.8rem);
		line-height: 1.12;
	}
</style>
