<script lang="ts">
	interface Props {
		markerStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
		density?: 'low' | 'medium' | 'high';
		animated?: boolean;
		opacity?: number;
		jitter?: number;
	}

	interface MarkerBox {
		left: number;
		right: number;
		top: number;
		bottom: number;
		length: number;
		height: number;
	}

	const VIEWBOX_WIDTH = 1000;
	const VIEWBOX_HEIGHT = 720;

	let {
		markerStart = 1,
		density = 'high',
		animated = true,
		opacity = 0.34,
		jitter = 20
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

	function createMarkerBox(strokeWidth: number): MarkerBox {
		const inset = densityInset[density];
		const margin = Math.max(8, inset + strokeWidth * 0.18 + jitter * 0.1); // TODO: check if jitter makes sense here
		const left = margin - strokeWidth * 0.65;
		const right = VIEWBOX_WIDTH - margin + strokeWidth * 0.65;
		const top = margin - strokeWidth * 0.6;
		const bottom = VIEWBOX_HEIGHT - margin + strokeWidth * 0.6;

		return {
			left,
			right,
			top,
			bottom,
			length: right - left,
			height: bottom - top
		};
	}

	interface Point {
		x: number;
		y: number;
	}

	function round(n: number): number {
		return Number(n.toFixed(2));
	}

	function getBoxIntersections(
		m: number,
		b: number,
		length: number,
		height: number
	): [Point, Point] | null {
		const eps = 0.01;
		const hits: Point[] = [];

		// Top edge (y=0): x = -b/m
		const xTop = -b / m;
		if (xTop >= 0 && xTop <= length) {
			hits.push({ x: xTop, y: 0 });
		}

		// Bottom edge (y=height): x = (height - b) / m
		const xBot = (height - b) / m;
		if (xBot >= 0 && xBot <= length) {
			hits.push({ x: xBot, y: height });
		}

		// Left edge (x=0): y = b
		if (b >= 0 && b <= height) {
			if (!hits.some((p) => Math.abs(p.x) < eps && Math.abs(p.y - b) < eps)) {
				hits.push({ x: 0, y: b });
			}
		}

		// Right edge (x=length): y = m * length + b
		const yRight = m * length + b;
		if (yRight >= 0 && yRight <= height) {
			if (!hits.some((p) => Math.abs(p.x - length) < eps && Math.abs(p.y - yRight) < eps)) {
				hits.push({ x: length, y: yRight });
			}
		}

		if (hits.length < 2) return null;

		hits.sort((a, b) => a.x - b.x || a.y - b.y);
		return [hits[0], hits[1]];
	}

	function randomNormal(mean: number, stdDev: number, clamp?: number): number {
		const u1 = Math.max(Math.random(), 1e-10);
		const u2 = Math.random();
		const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		const value = mean + z * stdDev;
		if (clamp === undefined) return value;
		return Math.max(mean - clamp, Math.min(mean + clamp, value));
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
		let b = -baseSlope * box.length * 0.05;

		let intersections = getBoxIntersections(baseSlope, b, box.length, box.height);
		if (intersections) moveTo(intersections[0]);

		while (intersections) {
			let [p1, p2] = intersections;
			lineTo(p1);
			lineTo(p2);
			b += bStep;
			let m = randomNormal(baseSlope, 0.03, 0.025);
			intersections = getBoxIntersections(m, b, box.length, box.height);
		}

		return parts.join(' ');
	}

	let pathD = $derived(strokePath());
	let pathStroke = $derived(markerVar(0));
	let pathWidth = $derived(widthFor());
	let pathOpacity = $derived(opacityFor());
</script>

<div class={`marker-fill ${animated ? 'is-animated' : ''}`} aria-hidden="true">
	<svg viewBox="0 0 1000 720" preserveAspectRatio="none" role="presentation">
		<path
			pathLength="1"
			d={pathD}
			style={`--stroke:${pathStroke}; --width:${pathWidth}; --opacity:${pathOpacity}; --delay:0ms;`}
		/>
	</svg>
</div>

<style>
	.marker-fill {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: transparent;
		isolation: isolate;
	}

	svg {
		width: 100%;
		height: 100%;
		display: block;
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
