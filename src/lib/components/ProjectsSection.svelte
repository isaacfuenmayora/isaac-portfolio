<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';
	import type { Project } from '$lib/data/site';

	interface Props {
		projects: Project[];
	}

	let { projects }: Props = $props();
</script>

<PageSection id="projects" palette="MF">
	<div class="container">
		<header>
			<p class="eyebrow">Featured Projects</p>
			<h2 class="section-title">What I have built</h2>
		</header>

		<div class="grid">
			{#each projects as project (project.slug)}
				<article
					id={`project-${project.slug}`}
					class="use-theme-background-soft"
					data-palette={project.palette}
				>
					<h3>{project.title}</h3>
					<p>{project.summary}</p>
					<p class="meta-label">Why it matters</p>
					<p>{project.impact}</p>
					<ul>
						{#each project.tags as tag (tag)}
							<li>{tag}</li>
						{/each}
					</ul>
					<a href={project.href}>Read more</a>
				</article>
			{/each}
		</div>
	</div>
</PageSection>

<style>
	.container {
		display: grid;
		gap: var(--space-4);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
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
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	article li {
		padding: 0.25rem 0.5rem;
		border: 1px solid color-mix(in srgb, var(--theme-outline) 55%, transparent);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	article a {
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

	@media (max-width: 980px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 720px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
