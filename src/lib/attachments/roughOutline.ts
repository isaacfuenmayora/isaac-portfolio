import { createRoughSketch } from '$lib/utils/roughSketch';
import type { RoughSketchOptions, DrawFn } from '$lib/utils/roughSketch';
import type { Attachment } from 'svelte/attachments';

function makeRoughAttachment(options: RoughSketchOptions, draw: DrawFn): Attachment {
	return (node: Element) => {
		const el = node as HTMLElement;
		const sketch = createRoughSketch(el, options, draw);
		return sketch.destroy;
	};
}

export function roughRectangle(options: RoughSketchOptions = {}): Attachment {
	return makeRoughAttachment(options, ({ rc, width, height, roughOptions }) =>
		rc.rectangle(0, 0, width, height, { fill: 'none', ...roughOptions })
	);
}

export function roughEllipse(options: RoughSketchOptions = {}): Attachment {
	return makeRoughAttachment(options, ({ rc, width, height, roughOptions }) => {
		const aspect = width / height;
		const inflate = 1 + Math.min(aspect * 0.04, 0.1); // scales with how stretched it is
		return rc.ellipse(width / 2, height / 2, width * inflate, height * 1.25, {
			fill: 'none',
			...roughOptions
		});
	});
}

export function roughPill(options: RoughSketchOptions = {}): Attachment {
	return makeRoughAttachment(options, ({ rc, width, height, roughOptions }) => {
		const r = height / 2;

		const path = [
			`M ${r} 0`,
			`L ${width - r} 0`,
			`A ${r} ${r} 0 0 1 ${width - r} ${height}`,
			`L ${r} ${height}`,
			`A ${r} ${r} 0 0 1 ${r} 0`,
			'Z'
		].join(' ');

		return rc.path(path, roughOptions);
	});
}
