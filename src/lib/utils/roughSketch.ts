import rough from 'roughjs';
import type { RoughSVG } from 'roughjs/bin/svg';
import type { Options as RoughOptions } from 'roughjs/bin/core';

export interface RoughSketchOptions extends RoughOptions {
	redrawOnHover?: boolean;
	redrawIntervalMs?: number;
}

interface ResolvedRoughSketchOptions extends RoughOptions {
	redrawOnHover: boolean;
	redrawIntervalMs: number;
}

const DEFAULTS: ResolvedRoughSketchOptions = {
	roughness: 1.3,
	stroke: 'currentColor',
	strokeWidth: 2,
	bowing: 1,
	redrawOnHover: false,
	redrawIntervalMs: 250
};

type DrawFn = (args: {
	rc: RoughSVG;
	svg: SVGSVGElement;
	width: number;
	height: number;
	roughOptions: RoughOptions;
}) => SVGGElement | SVGGElement[];

function createSVGElement(): SVGSVGElement {
	const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	Object.assign(svgEl.style, {
		position: 'absolute',
		inset: '0',
		width: '100%',
		height: '100%',
		pointerEvents: 'none',
		overflow: 'visible'
	});
	svgEl.setAttribute('aria-hidden', 'true');

	return svgEl;
}

/**
 * Creates a rough.js sketch overlay on `el`, returning `redraw` and `destroy` handles.
 * @param el - Host element the SVG overlay is appended to.
 * @param options - rough.js drawing options plus `redrawOnHover` and `redrawIntervalMs`.
 * @param drawFn - Called on every draw pass with the rough canvas, dimensions, and resolved options. Return the element(s) to append.
 */
export function createRoughSketch(el: HTMLElement, options: RoughSketchOptions, drawFn: DrawFn) {
	const { redrawOnHover, redrawIntervalMs, ...roughOptions } = { ...DEFAULTS, ...options };

	const svg = createSVGElement();

	if (getComputedStyle(el).position === 'static') {
		el.style.position = 'relative';
	}
	el.appendChild(svg);

	function draw() {
		const { width, height } = el.getBoundingClientRect();
		svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
		svg.replaceChildren();
		const rc = rough.svg(svg);
		const result = drawFn({ rc, svg, width, height, roughOptions });
		const elements = Array.isArray(result) ? result : [result];
		elements.forEach((el) => svg.appendChild(el));
	}

	draw();

	const observer = new ResizeObserver(draw);
	observer.observe(el);

	let animationId: number | null = null;
	let lastRedrawTime = performance.now();

	function startRedrawLoop() {
		function tick() {
			if (performance.now() - lastRedrawTime >= redrawIntervalMs) {
				lastRedrawTime = performance.now();
				draw();
			}
			animationId = requestAnimationFrame(tick);
		}
		animationId = requestAnimationFrame(tick);
	}

	function stopRedrawLoop() {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
	}

	if (redrawOnHover) {
		el.addEventListener('mouseenter', startRedrawLoop);
		el.addEventListener('mouseleave', stopRedrawLoop);
	}

	return {
		redraw: draw,
		destroy() {
			observer.disconnect();
			stopRedrawLoop();
			el.removeEventListener('mouseenter', startRedrawLoop);
			el.removeEventListener('mouseleave', stopRedrawLoop);
			svg.remove();
		}
	};
}
