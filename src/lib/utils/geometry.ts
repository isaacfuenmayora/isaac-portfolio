export interface Point {
	x: number;
	y: number;
}

export class Rectangle {
	readonly left: number;
	readonly top: number;
	readonly right: number;
	readonly bottom: number;

	constructor(left: number, top: number, right: number, bottom: number) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}

	get length(): number {
		return this.right - this.left;
	}

	get height(): number {
		return this.bottom - this.top;
	}

	inset(pad: number): Rectangle {
		return new Rectangle(this.left + pad, this.top + pad, this.right - pad, this.bottom - pad);
	}

	toWorld(p: Point): Point {
		return { x: p.x + this.left, y: p.y + this.top };
	}

	// Intersections of y = mx + b (in this rect's local coords) with the rect's edges.
	// Returns the two boundary points sorted by x, or null if the line misses the rect.
	getIntersections(m: number, b: number): [Point, Point] | null {
		const eps = 0.01;
		const { length, height } = this;
		const hits: Point[] = [];

		const xTop = -b / m;
		if (xTop >= 0 && xTop <= length) hits.push({ x: xTop, y: 0 });

		const xBot = (height - b) / m;
		if (xBot >= 0 && xBot <= length) hits.push({ x: xBot, y: height });

		if (b >= 0 && b <= height) {
			if (!hits.some((p) => Math.abs(p.x) < eps && Math.abs(p.y - b) < eps)) {
				hits.push({ x: 0, y: b });
			}
		}

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
}
