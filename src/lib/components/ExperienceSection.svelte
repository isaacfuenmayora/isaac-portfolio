<script lang="ts">
	import MarkerFill from '$lib/components/MarkerFill.svelte';
	import PageSection from '$lib/components/PageSection.svelte';
	import type { ExperienceEntry } from '$lib/data/site';
	import { roughRectangle } from '$lib/attachments/roughOutline';

	interface Props {
		experience: ExperienceEntry[];
	}

	let { experience }: Props = $props();
</script>

<PageSection id="experience" palette="NK" overline="Experience" title="Where I've worked">
	<div class="list">
		{#each experience as entry (entry.company)}
			<MarkerFill color="var(--theme-marker-2)" opacity={0.8} inset={10} slope={-1.8}>
				<article
					data-palette={entry.palette}
					{@attach roughRectangle({
						roughness: 3,
						stroke: 'var(--theme-outline)',
						redrawOnHover: true
					})}
				>
					<h3>{entry.role} - {entry.company}</h3>
					<p class="meta-label">{entry.dates}</p>
					<ul>
						{#each entry.highlights as highlight (highlight)}
							<li>{highlight}</li>
						{/each}
					</ul>
				</article>
			</MarkerFill>
		{/each}
	</div>
</PageSection>

<style>
	.list {
		display: grid;
		gap: var(--space-7);
	}

	article {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.8rem;
		padding: clamp(1rem, 2.5vw, 1.75rem);
		border: 2px solid var(--theme-outline);
		border-radius: var(--radius-lg);
		background: transparent;
	}

	h3,
	article p {
		margin: 0;
	}

	article ul {
		display: grid;
		gap: 0.55rem;
		padding: 0 0 0 1rem;
		margin: 0;
	}
</style>
