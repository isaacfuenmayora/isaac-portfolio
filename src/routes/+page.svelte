<script lang="ts">
	import { onMount } from 'svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import ExperienceSection from '$lib/components/ExperienceSection.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import ProjectsSection from '$lib/components/ProjectsSection.svelte';
	import TopNav from '$lib/components/TopNav.svelte';
	import {
		contact,
		contactLinks,
		experience,
		hero,
		heroLinks,
		projects,
		sectionLinks
	} from '$lib/data/site';
	import { initPaletteTransition } from '$lib/utils/paletteTransition';

	onMount(initPaletteTransition);
</script>

<svelte:head>
	<title>Isaac Fuenmayor | Software Engineer</title>
	<meta
		name="description"
		content="Software engineer portfolio featuring projects, experience, and contact information."
	/>
	<meta name="robots" content="index, follow" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://hireisaac.dev" />
	<meta property="og:title" content="Isaac Fuenmayor | Software Engineer" />
	<meta
		property="og:description"
		content="Software engineer building polished, performant web experiences with SvelteKit and TypeScript."
	/>
	<meta property="og:image" content="https://hireisaac.dev/og-image.png" />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="icon" href="/favicon.ico" sizes="32x32" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<main>
	<TopNav brand={hero.name} links={sectionLinks} />
	<HeroSection {hero} {heroLinks} />
	<ProjectsSection {projects} />
	<ExperienceSection {experience} />
	<ContactSection {contact} {contactLinks} />
</main>

<style>
	main {
		display: grid;
		gap: 0;
		background: var(--theme-background);
	}
</style>
