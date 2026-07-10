<script lang="ts">
	import NavLinkItem from '$lib/components/NavLinkItem.svelte';
	import type { NavLink } from '$lib/data/site';

	interface Props {
		brand: string;
		links: NavLink[];
	}

	let { brand, links }: Props = $props();
</script>

<nav aria-label="Primary navigation">
	<div class="container" data-palette="SG2">
		<a href="#hero">{brand}</a>
		<div class="links">
			{#each links as link (link.href)}
				<NavLinkItem {link} className="nav-link" />
			{/each}
		</div>
	</div>
</nav>

<style>
	nav {
		position: sticky;
		top: 0;
		z-index: 10;
		min-height: var(--nav-height);
		padding: var(--space-3) 0;
		background: var(--SG-Marker-2);
		/* border-bottom: 1px solid color-mix(in srgb, var(--theme-outline) 24%, transparent); */
	}

	nav .container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: nowrap;
		gap: var(--space-3);
	}

	nav .container > a {
		font-weight: 700;
		text-decoration: none;
	}

	.links {
		display: flex;
		flex-wrap: nowrap;
		gap: 1rem;
	}

	.links :global(a.nav-link) {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-decoration: none;
	}
</style>
