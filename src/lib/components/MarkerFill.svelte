<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Rectangle, type Point } from '$lib/utils/geometry';
	import { round, randomNormal } from '$lib/utils/math';

	const DEFAULT_STROKE_WIDTH_RATIO = 0.15;

	// Curvature: stdDev and clamp as fractions of strokeWidth (scaled by curvature prop)
	const CURVE_STDDEV_FACTOR = 0.15;
	const CURVE_CLAMP_FACTOR = 0.3;

	// Per-stroke slope jitter
	const SLOPE_JITTER_STDDEV = 0.0125;
	const SLOPE_JITTER_CLAMP = 0.02;

	interface Props {
		/** Stroke thickness in px. Defaults to 15% of container height. */
		strokeWidth?: number;
		/** Gap between strokes as a multiple of strokeWidth. @default 1.0 */
		spacing?: number;
		/** Angle of the hatching lines. @default -1.25 */
		slope?: number;
		/** How far (px) the marker box is inset from the content edge. Negative values extend past it. Overridden per-axis by insetX/insetY. @default 0 */
		inset?: number;
		/** Horizontal inset override (px). Falls back to inset. */
		insetX?: number;
		/** Vertical inset override (px). Falls back to inset. */
		insetY?: number;
		/** Max random per-stroke endpoint extension as a ratio of strokeWidth. Higher = spikier edges. @default 1.25 */
		jut?: number;
		/** Stroke color. @default 'currentColor' */
		color?: string;
		/** Whether to animate the draw-in. @default false */
		animated?: boolean;
		/** Stroke opacity (clamped to >= 0.1). @default 0.34 */
		opacity?: number;
		/** Wobble intensity of individual strokes. 0 = straight, higher = more curved. @default 0.5 */
		curvature?: number;
		children?: Snippet;
		[key: string]: unknown;
	}

	let {
		strokeWidth: strokeWidthProp,
		spacing = 1.0,
		slope = -1.25,
		inset: insetProp,
		insetX: insetXProp,
		insetY: insetYProp,
		jut = 1.25,
		color = 'currentColor',
		animated = false,
		opacity = 0.34,
		curvature = 0.5,
		class: className,
		children,
		...rest
	}: Props = $props();

	$effect(() => {
		if (curvature < 0) throw new Error(`MarkerFill: curvature must be >= 0, got ${curvature}`);
	});

	let containerEl: HTMLDivElement | undefined = $state();
	let containerWidth = $state(0);
	let containerHeight = $state(0);

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
	const insetX = $derived(insetXProp ?? insetProp ?? 0);
	const insetY = $derived(insetYProp ?? insetProp ?? 0);

	function opacityFor(): string {
		return `${Math.max(0.1, opacity)}`;
	}

	function createMarkerBox(): Rectangle {
		return new Rectangle(insetX, insetY, containerWidth - insetX, containerHeight - insetY);
	}

	function strokePath(): string {
		if (containerWidth === 0 || containerHeight === 0) return '';
		const markerBox = createMarkerBox();
		const parts: string[] = [];
		let current: Point = { x: 0, y: 0 };
		const normalize = (dx: number, dy: number): Point => {
			const len = Math.sqrt(dx * dx + dy * dy);
			return { x: dx / len, y: dy / len };
		};
		const moveTo = (point: Point) => {
			current = point;
			const x = markerBox.left + point.x;
			const y = markerBox.top + point.y;
			parts.push(`M ${round(x)} ${round(y)}`);
		};
		const curveTo = (end: Point) => {
			const unit = normalize(end.x - current.x, end.y - current.y);
			const perpOffset = randomNormal(
				0,
				strokeWidth * CURVE_STDDEV_FACTOR * curvature,
				strokeWidth * CURVE_CLAMP_FACTOR * curvature
			);
			const controlX = markerBox.left + (current.x + end.x) / 2 + -unit.y * perpOffset;
			const controlY = markerBox.top + (current.y + end.y) / 2 + unit.x * perpOffset;
			const endX = markerBox.left + end.x;
			const endY = markerBox.top + end.y;
			current = end;
			parts.push(`Q ${round(controlX)} ${round(controlY)} ${round(endX)} ${round(endY)}`);
		};

		const gap = strokeWidth * spacing;
		const bStep = gap * Math.sqrt(1 + slope * slope);
		const maxExtend = strokeWidth * jut;

		let b = -slope * markerBox.length * 0.025; // start slightly inside the top left of box
		let m = slope;
		let intersections = markerBox.getIntersections(m, b);
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
			intersections = markerBox.getIntersections(m, b);
		}

		return parts.join(' ');
	}
</script>

<div
	class={`marker-fill ${animated ? 'is-animated' : 'is-static'} ${className ?? ''}`}
	bind:this={containerEl}
	{...rest}
>
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

	.is-static path {
		animation: none;
		stroke-dasharray: none;
		stroke-dashoffset: 0;
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
