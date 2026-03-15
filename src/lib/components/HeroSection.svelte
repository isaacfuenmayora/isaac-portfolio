<script lang="ts">
	import NavLinkItem from '$lib/components/NavLinkItem.svelte';
	import type { NavLink, PaletteName } from '$lib/data/site';

	interface HeroData {
		name: string;
		role: string;
		summary: string;
		subline: string;
		palette: PaletteName;
	}

	interface Props {
		hero: HeroData;
		heroLinks: NavLink[];
	}

	let { hero, heroLinks }: Props = $props();
</script>

<section id="hero" class="use-theme-prev-bridge" data-palette={hero.palette}>
	<div class="container">
		<p class="eyebrow">{hero.role}</p>
		<h1>{hero.name}</h1>
		<p class="section-description">{hero.summary}</p>
		<p>{hero.subline}</p>
		<div class="actions">
			{#each heroLinks as link (link.href)}
				<NavLinkItem {link} className="hero-link" />
			{/each}
		</div>
	</div>
</section>

<style>
	section {
		padding: clamp(3.25rem, 8vw, 6rem) 0;
	}

	section .container {
		display: grid;
		gap: var(--space-4);
	}

	h1 {
		margin: 0;
		font-size: clamp(2.3rem, 8vw, 4.5rem);
		line-height: 1.02;
	}

	section .container > p {
		margin: 0;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.actions :global(a.hero-link) {
		display: inline-flex;
		width: fit-content;
		padding: 0.5rem 0.8rem;
		border: 2px solid color-mix(in srgb, var(--theme-outline) 80%, black 20%);
		border-radius: 10px;
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
</style>
