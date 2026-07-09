import { createRoughSketch, type RoughSketchOptions } from '$lib/utils/roughSketch';
import type { Attachment } from 'svelte/attachments';

export function roughOutline(options: RoughSketchOptions = {}): Attachment {
	return (node: Element) => {
		const el = node as HTMLElement;

		const sketch = createRoughSketch(el, options, ({ rc, width, height, roughOptions }) => {
			return rc.rectangle(0, 0, width, height, { fill: 'none', ...roughOptions });
		});

		return sketch.destroy;
	};
}
