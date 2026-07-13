<script lang="ts">
	import MarkerFill from '$lib/components/MarkerFill.svelte';
	import NavLinkItem from '$lib/components/NavLinkItem.svelte';
	import PageSection from '$lib/components/PageSection.svelte';
	import type { NavLink, PaletteName } from '$lib/data/site';
	import { roughRectangle } from '$lib/attachments/roughOutline';

	interface ContactData {
		cta: string;
		palette: PaletteName;
	}

	interface Props {
		contact: ContactData;
		contactLinks: NavLink[];
	}

	let { contact, contactLinks }: Props = $props();
</script>

<PageSection id="contact" palette={contact.palette} overline="Contact" title="Let's connect">
	<MarkerFill color="var(--theme-marker-2)" opacity={0.7} inset={5} slope={-1} spacing={0.6}>
		<article
			{@attach roughRectangle({
				roughness: 2,
				stroke: 'var(--theme-outline)',
				redrawOnHover: true
			})}
		>
			<p>{contact.cta}</p>
			<div class="contact-links">
				{#each contactLinks as link (link.href)}
					<NavLinkItem
						{link}
						{@attach roughRectangle({ redrawOnHover: true })}
						className="contact-link"
					/>
				{/each}
			</div>
		</article>
	</MarkerFill>
</PageSection>

<style>
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

	article p {
		margin: 0;
	}

	.contact-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	.contact-links :global(a.contact-link) {
		display: inline-flex;
		width: fit-content;
		padding: 0.5rem 0.8rem;
		border-radius: 10px;
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
</style>
