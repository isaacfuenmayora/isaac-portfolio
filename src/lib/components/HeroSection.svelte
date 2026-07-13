<script lang="ts">
	import MarkerFill from '$lib/components/MarkerFill.svelte';
	import NavLinkItem from '$lib/components/NavLinkItem.svelte';
	import PageSection from '$lib/components/PageSection.svelte';
	import { contact } from '$lib/data/site';
	import type { NavLink, PaletteName } from '$lib/data/site';
	import { roughRectangle } from '$lib/attachments/roughOutline';
	import RoughPath from './RoughPath.svelte';

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

	type Icon = {
		href: string;
		path: string;
	};
	let icons: Icon[] = [
		{
			href: contact.linkedin,
			path: 'M216,20H40A20,20,0,0,0,20,40V216a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V40A20,20,0,0,0,216,20Zm-4,192H44V44H212ZM112,176V120a12,12,0,0,1,21.43-7.41A40,40,0,0,1,192,148v28a12,12,0,0,1-24,0V148a16,16,0,0,0-32,0v28a12,12,0,0,1-24,0ZM96,120v56a12,12,0,0,1-24,0V120a12,12,0,0,1,24,0ZM68,80A16,16,0,1,1,84,96,16,16,0,0,1,68,80Z'
		},
		{
			href: contact.github,
			path: 'M212.62,75.17A63.7,63.7,0,0,0,206.39,26,12,12,0,0,0,196,20a63.71,63.71,0,0,0-50,24H126A63.71,63.71,0,0,0,76,20a12,12,0,0,0-10.39,6,63.7,63.7,0,0,0-6.23,49.17A61.5,61.5,0,0,0,52,104v8a60.1,60.1,0,0,0,45.76,58.28A43.66,43.66,0,0,0,92,192v4H76a20,20,0,0,1-20-20,44.05,44.05,0,0,0-44-44,12,12,0,0,0,0,24,20,20,0,0,1,20,20,44.05,44.05,0,0,0,44,44H92v12a12,12,0,0,0,24,0V192a20,20,0,0,1,40,0v40a12,12,0,0,0,24,0V192a43.66,43.66,0,0,0-5.76-21.72A60.1,60.1,0,0,0,220,112v-8A61.5,61.5,0,0,0,212.62,75.17ZM196,112a36,36,0,0,1-36,36H112a36,36,0,0,1-36-36v-8a37.87,37.87,0,0,1,6.13-20.12,11.65,11.65,0,0,0,1.58-11.49,39.9,39.9,0,0,1-.4-27.72,39.87,39.87,0,0,1,26.41,17.8A12,12,0,0,0,119.82,68h32.35a12,12,0,0,0,10.11-5.53,39.84,39.84,0,0,1,26.41-17.8,39.9,39.9,0,0,1-.4,27.72,12,12,0,0,0,1.61,11.53A37.85,37.85,0,0,1,196,104Z'
		}
	];
</script>

<PageSection id="hero" palette={hero.palette}>
	<MarkerFill
		color="var(--theme-marker-2)"
		opacity={0.36}
		animated={true}
		inset={30}
	>
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
						{#each icons as icon (icon.href)}
							<a href={icon.href} target="_blank" rel="noreferrer">
								<RoughPath
									width="40px"
									height="40px"
									viewBox="0 0 256 256"
									strokeWidth={7.5}
									roughness={2.5}
									d={icon.path}
									redrawOnHover={true}
									fill="black"
									hachureGap={8}
								/>
							</a>
						{/each}
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

	.social-icons {
		position: absolute;
		/* TODO: decide if I want this in top right or bottom right and mobile view*/
		/* bottom: var(--space-3); */
		top: var(--space-3);
		right: var(--space-3);
		display: flex;
		gap: 0.5rem;
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

	@media (max-width: 433px) {
		.social-icons {
			position: static;
			margin-left: auto;
		}
	}
</style>
