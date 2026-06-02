<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Rectangle, type Point } from '$lib/utils/geometry';
	import { round, randomNormal } from '$lib/utils/math';

	// SSR fallback dimensions before ResizeObserver fires
	const FALLBACK_WIDTH = 1000;
	const FALLBACK_HEIGHT = 720;

	// Proportion of container height used as default stroke width
	const DEFAULT_STROKE_WIDTH_RATIO = 0.15;
	// Proportion of the shorter container side used as default inset
	const DEFAULT_INSET_RATIO = 0.15;

	// Box geometry: margin overshoot as fraction of strokeWidth; extend as fraction of container dimension
	const BOX_MARGIN_STROKE_FACTOR = 0.18;
	const BOX_EXTEND_X_FACTOR = 0.035; // fraction of containerWidth
	const BOX_EXTEND_Y_FACTOR = 0.05; // fraction of containerHeight

	// Curvature: stdDev and clamp as fractions of strokeWidth (scaled by curvature prop)
	const CURVE_STDDEV_FACTOR = 0.15;
	const CURVE_CLAMP_FACTOR = 0.3;

	// Per-stroke slope jitter
	const SLOPE_JITTER_STDDEV = 0.0125;
	const SLOPE_JITTER_CLAMP = 0.02;

	interface Props {
		strokeWidth?: number;
		strokeSpacing?: number;
		slope?: number;
		inset?: number;
		color?: string;
		animated?: boolean;
		opacity?: number;
		curvature?: number;
		children?: Snippet;
	}

	let {
		strokeWidth: strokeWidthProp,
		strokeSpacing = 1.0,
		slope = -1.25,
		inset: insetProp,
		color = 'currentColor',
		animated = true,
		opacity = 0.34,
		curvature = 0.5,
		children
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let containerWidth = $state(FALLBACK_WIDTH);
	let containerHeight = $state(FALLBACK_HEIGHT);

	$effect(() => {
		if (!containerEl) return;
		const observer = new ResizeObserver(([entry]) => {
			containerWidth = entry.contentRect.width;
			containerHeight = entry.contentRect.height;
		});
		observer.observe(containerEl);
		return () => observer.disconnect();
	});

	const strokeWidth = $derived(strokeWidthProp ?? containerHeight * DEFAULT_STROKE_WIDTH_RATIO);
	const inset = $derived(
		insetProp ?? Math.min(containerWidth, containerHeight) * DEFAULT_INSET_RATIO
	);

	$effect(() => {
		if (curvature < 0) throw new Error(`MarkerFill: curvature must be >= 0, got ${curvature}`);
	});

	function opacityFor(): string {
		return `${Math.max(0.1, opacity)}`;
	}

	function createInnerBox(): Rectangle {
		const margin = Math.max(8, inset + strokeWidth * BOX_MARGIN_STROKE_FACTOR);
		const extendX = containerWidth * BOX_EXTEND_X_FACTOR;
		const extendY = containerHeight * BOX_EXTEND_Y_FACTOR;
		return new Rectangle(
			Math.max(0, margin - extendX),
			Math.max(0, margin - extendY),
			Math.min(containerWidth, containerWidth - margin + extendX),
			Math.min(containerHeight, containerHeight - margin + extendY)
		);
	}

	function strokePath(): string {
		const innerBox = createInnerBox();
		const parts: string[] = [];
		let current: Point = { x: 0, y: 0 };
		const normalize = (dx: number, dy: number): Point => {
			const len = Math.sqrt(dx * dx + dy * dy);
			return { x: dx / len, y: dy / len };
		};
		const moveTo = (point: Point) => {
			current = point;
			const x = innerBox.left + point.x;
			const y = innerBox.top + point.y;
			parts.push(`M ${round(x)} ${round(y)}`);
		};
		const curveTo = (end: Point) => {
			const unit = normalize(end.x - current.x, end.y - current.y);
			const perpOffset = randomNormal(
				0,
				strokeWidth * CURVE_STDDEV_FACTOR * curvature,
				strokeWidth * CURVE_CLAMP_FACTOR * curvature
			);
			const controlX = innerBox.left + (current.x + end.x) / 2 + -unit.y * perpOffset;
			const controlY = innerBox.top + (current.y + end.y) / 2 + unit.x * perpOffset;
			const endX = innerBox.left + end.x;
			const endY = innerBox.top + end.y;
			current = end;
			parts.push(`Q ${round(controlX)} ${round(controlY)} ${round(endX)} ${round(endY)}`);
		};

		const gap = strokeWidth * strokeSpacing;
		const bStep = gap * Math.sqrt(1 + slope * slope);
		const maxExtend = strokeWidth * 1.5;

		let b = -slope * innerBox.length * 0.025; // start slightly inside the box
		let m = slope;
		let intersections = innerBox.getIntersections(m, b);
		let first = true;

		while (intersections) {
			const [p1, p2] = intersections;

			// Unit vector along the line from p1 → p2
			const unit = normalize(p2.x - p1.x, p2.y - p1.y);

			// Extend each end outward by a random amount up to maxExtend
			const startExtend = Math.random() * maxExtend;
			const endExtend = Math.random() * maxExtend;
			const extP1 = {
				x: p1.x - unit.x * startExtend,
				y: p1.y - unit.y * startExtend
			};
			const extP2 = {
				x: p2.x + unit.x * endExtend,
				y: p2.y + unit.y * endExtend
			};

			if (first) {
				moveTo(extP1);
				first = false;
			} else {
				curveTo(extP1);
			}
			curveTo(extP2);

			b += bStep;
			m = randomNormal(slope, SLOPE_JITTER_STDDEV, SLOPE_JITTER_CLAMP);
			intersections = innerBox.getIntersections(m, b);
		}

		return parts.join(' ');
	}
</script>

<div class={`marker-fill ${animated ? 'is-animated' : ''}`} bind:this={containerEl}>
	<svg
		class="marker-fill-svg"
		viewBox="0 0 {containerWidth} {containerHeight}"
		preserveAspectRatio="none"
		role="presentation"
		aria-hidden="true"
	>
		<path
			pathLength="1"
			d={strokePath()}
			style:--stroke={color}
			style:--width={strokeWidth}
			style:--opacity={opacityFor()}
			style:--delay="0ms"
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
