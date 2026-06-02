export function round(n: number): number {
	return Number(n.toFixed(2));
}

export function randomNormal(mean: number, stdDev: number, clamp?: number): number {
	const u1 = Math.max(Math.random(), 1e-10);
	const u2 = Math.random();
	const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
	const value = mean + z * stdDev;
	if (clamp === undefined) return value;
	return Math.max(mean - clamp, Math.min(mean + clamp, value));
}
