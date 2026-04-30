<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';
	import type { PaletteName } from '$lib/data/site';

	interface ContactData {
		email: string;
		github: string;
		linkedin: string;
		resume: string;
		cta: string;
		palette: PaletteName;
	}

	interface Props {
		contact: ContactData;
	}

	let { contact }: Props = $props();
</script>

<PageSection id="contact" palette={contact.palette}>
	<div class="container">
		<header>
			<p class="eyebrow">Contact</p>
			<h2 class="section-title">Let's connect</h2>
		</header>

		<article class="use-theme-background-soft">
			<p>{contact.cta}</p>
			<ul class="contact-links">
				<li><a href={contact.email}>Email</a></li>
				<li><a href={contact.github} target="_blank" rel="noreferrer">GitHub</a></li>
				<li><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
				<li><a href={contact.resume}>Resume</a></li>
			</ul>
		</article>
	</div>
</PageSection>

<style>
	.container {
		display: grid;
		gap: clamp(var(--space-3), 2.5vw, var(--space-6));
	}

	article {
		display: grid;
		gap: 0.8rem;
		padding: 1rem;
		border: 2px solid color-mix(in srgb, var(--theme-outline) 75%, black 25%);
		border-radius: var(--radius-md);
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

	.contact-links a {
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
