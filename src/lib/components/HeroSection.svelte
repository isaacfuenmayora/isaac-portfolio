<script lang="ts">
	import MarkerFill from '$lib/components/MarkerFill.svelte';
	import NavLinkItem from '$lib/components/NavLinkItem.svelte';
	import PageSection from '$lib/components/PageSection.svelte';
	import { contact } from '$lib/data/site';
	import type { NavLink, PaletteName } from '$lib/data/site';
	import { roughRectangle } from '$lib/attachments/roughOutline';
	import RoughIconLink from '$lib/components/RoughIconLink.svelte';

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

<PageSection id="hero" palette={hero.palette}>
	<MarkerFill color="var(--theme-marker-2)" opacity={0.36} animated={true} inset={30}>
		<div class="content-box">
			<div
				class="hero-content"
				{@attach roughRectangle({
					roughness: 4,
					stroke: 'var(--theme-outline)',
					redrawOnHover: true,
					redrawIntervalMs: 333
				})}
			>
				<p class="eyebrow">{hero.role}</p>
				<h1>{hero.name}</h1>
				<p class="section-description">{hero.summary}</p>
				<p>{hero.subline}</p>
				<div class="actions">
					{#each heroLinks as link (link.href)}
						<NavLinkItem
							{link}
							{@attach roughRectangle({ redrawOnHover: true })}
							className="hero-link"
						/>
					{/each}
					<div class="social-icons">
						<RoughIconLink href={contact.linkedin} icon="linkedin" label="LinkedIn" size="40px" />
						<RoughIconLink href={contact.github} icon="github" label="GitHub" size="40px" />
					</div>
				</div>
			</div>
		</div>
	</MarkerFill>
</PageSection>

<style>
	.content-box {
		position: relative;
		z-index: 1;
		margin: 1.3rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--theme-outline);
		background: transparent;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		display: grid;
		gap: var(--space-4);
		padding: clamp(1rem, 2.5vw, 1.75rem);
	}

	h1 {
		margin: 0;
		font-size: clamp(2.3rem, 8vw, 4.5rem);
		line-height: 1.02;
	}

	.hero-content > p {
		margin: 0;
	}

	.section-description {
		font-size: clamp(1rem, 1.4vw, 1.1rem);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.actions :global(a.hero-link) {
		display: inline-flex;
		width: fit-content;
		padding: 0.5rem 0.8rem;
		/* border: 2px solid color-mix(in srgb, var(--theme-outline) 80%, black 20%); */
		/* border: 2px solid var(--theme-outline); */
		border-radius: 10px;
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
</style>
