<script lang="ts">
	import type { ExperienceEntry } from '$lib/data/site';

	interface Props {
		experience: ExperienceEntry[];
	}

	let { experience }: Props = $props();
</script>

<section id="experience" class="use-theme-gradient" data-palette="NK">
	<div class="container">
		<header>
			<p class="eyebrow">Experience</p>
			<h2 class="section-title">Where I have worked</h2>
		</header>

		<div class="list">
			{#each experience as entry (entry.company)}
				<article class="use-theme-background-soft" data-palette={entry.palette}>
					<h3>{entry.role} - {entry.company}</h3>
					<p class="meta-label">{entry.dates}</p>
					<ul>
						{#each entry.highlights as highlight (highlight)}
							<li>{highlight}</li>
						{/each}
					</ul>
				</article>
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

	.list {
		display: grid;
		gap: var(--space-3);
	}

	article {
		display: grid;
		gap: 0.8rem;
		padding: 1rem;
		border: 2px solid color-mix(in srgb, var(--theme-outline) 75%, black 25%);
		border-radius: var(--radius-md);
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
