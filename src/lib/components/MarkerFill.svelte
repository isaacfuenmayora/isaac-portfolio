<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Rectangle, type Point } from '$lib/utils/geometry';

	interface Props {
		markerStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
		density?: 'low' | 'medium' | 'high';
		animated?: boolean;
		opacity?: number;
		children?: Snippet;
	}

	const VIEWBOX_WIDTH = 1000;
	const VIEWBOX_HEIGHT = 720;

	let {
		markerStart = 1,
		density = 'high',
		animated = true,
		opacity = 0.34,
		children
	}: Props = $props();

	const densityWidth: Record<'low' | 'medium' | 'high', number> = {
		low: 36,
		medium: 54,
		high: 72
	};

	const densityInset: Record<'low' | 'medium' | 'high', number> = {
		low: 56,
		medium: 40,
		high: 24
	};

	function markerVar(index: number): string {
		const marker = (((markerStart - 1 + index) % 7) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
		return `var(--theme-marker-${marker})`;
	}

	function widthNumber(): number {
		return Math.max(26, densityWidth[density]);
	}

	function widthFor(): string {
		return `${widthNumber()}`;
	}

	function opacityFor(): string {
		return `${Math.max(0.1, opacity)}`;
	}

	function round(n: number): number {
		return Number(n.toFixed(2));
	}

	function randomNormal(mean: number, stdDev: number, clamp?: number): number {
		const u1 = Math.max(Math.random(), 1e-10);
		const u2 = Math.random();
		const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		const value = mean + z * stdDev;
		if (clamp === undefined) return value;
		return Math.max(mean - clamp, Math.min(mean + clamp, value));
	}

	function createMarkerBox(strokeWidth: number): Rectangle {
		const margin = Math.max(8, densityInset[density] + strokeWidth * 0.18);
		return new Rectangle(
			margin - strokeWidth * 0.65,
			margin - strokeWidth * 0.6,
			VIEWBOX_WIDTH - margin + strokeWidth * 0.65,
			VIEWBOX_HEIGHT - margin + strokeWidth * 0.6
		);
	}

	function strokePath(): string {
		const strokeWidth = widthNumber();
		const box = createMarkerBox(strokeWidth);
		const parts: string[] = [];
		const moveTo = (point: Point) => {
			const x = box.left + point.x;
			const y = box.top + point.y;
			parts.push(`M ${round(x)} ${round(y)}`);
		};
		const lineTo = (point: Point) => {
			const x = box.left + point.x;
			const y = box.top + point.y;
			parts.push(`L ${round(x)} ${round(y)}`);
		};

		const baseSlope = -1.2;
		const spacing = strokeWidth * 1.1;
		const bStep = spacing * Math.sqrt(1 + baseSlope * baseSlope);
		const maxExtend = strokeWidth * 1.5;

		let b = -baseSlope * box.length * 0.05;
		let m = baseSlope;
		let intersections = box.getIntersections(m, b);
		let first = true;

		while (intersections) {
			const [p1, p2] = intersections;

			// Unit vector along the line from p1 → p2
			const dx = p2.x - p1.x;
			const dy = p2.y - p1.y;
			const len = Math.sqrt(dx * dx + dy * dy);
			const ux = dx / len;
			const uy = dy / len;

			// Extend each end outward by a random amount up to maxExtend
			const startExtend = Math.random() * maxExtend;
			const endExtend = Math.random() * maxExtend;
			const extP1 = { x: p1.x - ux * startExtend, y: p1.y - uy * startExtend };
			const extP2 = { x: p2.x + ux * endExtend, y: p2.y + uy * endExtend };

			if (first) {
				moveTo(extP1);
				first = false;
			} else {
				lineTo(extP1);
			}
			lineTo(extP2);

			b += bStep;
			m = randomNormal(baseSlope, 0.03, 0.025);
			intersections = box.getIntersections(m, b);
		}

		return parts.join(' ');
	}

	let pathD = $derived(strokePath());
	let pathStroke = $derived(markerVar(0));
	let pathWidth = $derived(widthFor());
	let pathOpacity = $derived(opacityFor());
</script>

<div class={`marker-fill ${animated ? 'is-animated' : ''}`}>
	<svg
		class="marker-fill-svg"
		viewBox="0 0 1000 720"
		preserveAspectRatio="none"
		role="presentation"
		aria-hidden="true"
	>
		<path
			pathLength="1"
			d={pathD}
			style={`--stroke:${pathStroke}; --width:${pathWidth}; --opacity:${pathOpacity}; --delay:0ms;`}
		/>
	</svg>
	{@render children?.()}
</div>

<style>
	.marker-fill {
		position: relative;
		isolation: isolate;
	}

	.marker-fill-svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		overflow: visible;
		pointer-events: none;
		z-index: 0;
	}

	path {
		fill: none;
		stroke: var(--stroke);
		stroke-width: var(--width, 140);
		opacity: var(--opacity, 0.3);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-miterlimit: 3;
	}

	.is-animated path {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw-marker 3000ms var(--easing-snappy) forwards;
		animation-delay: var(--delay, 0ms);
	}

	@keyframes draw-marker {
		from {
			stroke-dashoffset: 1;
		}

		to {
			stroke-dashoffset: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.is-animated path {
			animation: none;
			stroke-dasharray: none;
			stroke-dashoffset: 0;
		}
	}
</style>
