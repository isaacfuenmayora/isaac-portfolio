import rough from 'roughjs';
import type { Options as RoughOptions } from 'roughjs/bin/core';
import type { Attachment } from 'svelte/attachments';

export interface RoughOutlineOptions extends RoughOptions {
	redrawOnHover?: boolean;
	redrawIntervalMs?: number;
}

interface ResolvedRoughOutlineOptions extends RoughOptions {
	redrawOnHover: boolean;
	redrawIntervalMs: number;
}

const DEFAULTS: ResolvedRoughOutlineOptions = {
	roughness: 1.3,
	stroke: 'currentColor',
	strokeWidth: 2,
	bowing: 1,
	redrawOnHover: false,
	redrawIntervalMs: 250
};

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

export function roughOutline(options: RoughOutlineOptions = {}): Attachment {
	const { redrawOnHover, redrawIntervalMs, ...roughOptions } = { ...DEFAULTS, ...options };

	return (node: Element) => {
		const el = node as HTMLElement;

		const svgEl = createSVGElement();

		if (getComputedStyle(el).position === 'static') {
			el.style.position = 'relative';
		}

		el.appendChild(svgEl);

		function draw() {
			const { width, height } = el.getBoundingClientRect();
			svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
			svgEl.replaceChildren();

			const roughCanvas = rough.svg(svgEl);
			svgEl.appendChild(
				roughCanvas.rectangle(0, 0, width, height, { fill: 'none', ...roughOptions })
			);
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

		return () => {
			observer.disconnect();
			stopRedrawLoop();
			el.removeEventListener('mouseenter', startRedrawLoop);
			el.removeEventListener('mouseleave', stopRedrawLoop);
			svgEl.remove();
		};
	};
}
