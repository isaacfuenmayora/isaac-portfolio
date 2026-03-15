<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<!-- TODO: Remove this layout if it remains a pure pass-through wrapper. -->
{@render children?.()}
