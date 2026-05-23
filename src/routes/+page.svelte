<script lang="ts">
	import { onMount } from 'svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import ExperienceSection from '$lib/components/ExperienceSection.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import ProjectsSection from '$lib/components/ProjectsSection.svelte';
	import TopNav from '$lib/components/TopNav.svelte';
	import { contact, experience, hero, heroLinks, projects, sectionLinks } from '$lib/data/site';
	import { initPaletteTransition } from '$lib/utils/paletteTransition';

	onMount(initPaletteTransition);
</script>

<svelte:head>
	<title>Isaac Fuenmayor | Software Engineer</title>
	<meta
		name="description"
		content="Software engineer portfolio featuring projects, experience, and contact information."
	/>
</svelte:head>

<main>
	<TopNav brand={hero.name} links={sectionLinks} />
	<HeroSection {hero} {heroLinks} />
	<ProjectsSection {projects} />
	<ExperienceSection {experience} />
	<ContactSection {contact} />
</main>

<style>
	main {
		display: grid;
		gap: 0;
		background: var(--theme-background);
	}
</style>
