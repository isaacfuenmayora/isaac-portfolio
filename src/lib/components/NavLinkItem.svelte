<script lang="ts">
	import type { NavLink } from '$lib/data/site';

	interface Props {
		link: NavLink;
		className?: string;
	}

	let { link, className = '' }: Props = $props();
</script>

<a
	href={link.href}
	target={link.external ? '_blank' : undefined}
	rel={link.external ? 'noreferrer' : undefined}
	class={className}
>
	{link.label}
</a>
