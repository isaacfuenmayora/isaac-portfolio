<script lang="ts">
	import MarkerFill from '$lib/components/MarkerFill.svelte';
	import PageSection from '$lib/components/PageSection.svelte';
	import RoughIconLink from '$lib/components/RoughIconLink.svelte';
	import type { Project } from '$lib/data/site';
	import { roughPill, roughRectangle } from '$lib/attachments/roughOutline';

	interface Props {
		projects: Project[];
	}

	let { projects }: Props = $props();
</script>

<PageSection id="projects" palette="MF" overline="Featured Projects" title="What I've built">
	<div class="list">
		{#each projects as project (project.slug)}
			<MarkerFill color="var(--theme-marker-1)" opacity={0.8} inset={10} slope={-0.5} spacing={0.5}>
				<article
					id={`project-${project.slug}`}
					data-palette={project.palette}
					{@attach roughRectangle({
						roughness: 2.5,
						stroke: 'var(--theme-outline)',
						redrawOnHover: true,
						redrawIntervalMs: 333
					})}
				>
					<h3>{project.title}</h3>
					<p>{project.summary}</p>
					<p class="meta-label">Why it matters</p>
					<p>{project.impact}</p>
					<div class="tags-row">
						<ul class="tags">
							{#each project.tags as tag (tag)}
								<li
									{@attach roughPill({
										roughness: 0.5,
										stroke: 'var(--theme-outline)',
										redrawOnHover: true
									})}
								>
									{tag}
								</li>
							{/each}
						</ul>
						{#if project.github}
							<RoughIconLink
								href={project.github}
								icon="github"
								label="{project.title} on GitHub"
								className="social-icons"
							/>
						{/if}
					</div>
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
		/* border: 2px solid var(--theme-outline);
		border-radius: var(--radius-lg); */
		background: transparent;
	}

	h3,
	article p {
		margin: 0;
	}

	.tags-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	.tags li {
		padding: 0.25rem 0.5rem;
		margin: 0 0.25rem;
		/* border: 1px solid color-mix(in srgb, var(--theme-outline) 55%, transparent);
		border-radius: 999px; */
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	/* TODO: consider adding "Read more" link using below styling */
	article a {
		display: inline-flex;
		width: fit-content;
		padding: 0.5rem 0.8rem;
		border: 2px solid var(--theme-outline);
		border-radius: 10px;
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
</style>
