interface Section {
	id: string;
	/** CSS value for this palette's background — a var() reference or resolved color. */
	bg: string;
	el: HTMLElement;
}

/**
 * Reads sections from the DOM in document order.
 * Each `<section data-palette="X">` element carries its own `--theme-background`
 * token via the [data-palette] CSS rules, so we pull the bg token directly from
 * computed styles — no hardcoded colors needed.
 */
function getSections(): Section[] {
	return Array.from(document.querySelectorAll<HTMLElement>('section[data-palette]')).flatMap(
		(el) => {
			if (!el.id) return [];
			// [data-palette='X'] rule sets --theme-background: var(--X-Background).
			// getComputedStyle returns the raw token stream, e.g. "var(--YI-Background)".
			// We store this token and later assign it to --curr-bg / --target-bg on :root,
			// letting CSS resolve the full chain inside color-mix().
			const bg = getComputedStyle(el).getPropertyValue('--theme-background').trim();
			if (!bg) return [];
			return [{ id: el.id, bg, el }];
		}
	);
}

function applyBg(currBg: string, targetBg: string, t: number) {
	const root = document.documentElement;
	const clamped = Math.max(0, Math.min(1, t));
	root.style.setProperty('--curr-bg', currBg);
	root.style.setProperty('--target-bg', targetBg);
	root.style.setProperty('--t', String(clamped));
}

function easeInOut(t: number): number {
	return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function getScrollState(sections: Section[]): {
	currBg: string;
	targetBg: string;
	t: number;
} | null {
	if (sections.length === 0) return null;

	const vh = window.innerHeight;
	const currIndex =
		sections.findLastIndex((section) => {
			const rect = section.el.getBoundingClientRect();
			return rect.top <= vh * 0.5;
		});
	if (currIndex === -1) {
		// TODO: This case shouldn't happen, maybe should log error?
		// No section has reached the viewport center yet, so we use the first section's bg.
		const first = sections[0];
		return { currBg: first.bg, targetBg: first.bg, t: 0 };
	}

	const curr = sections[currIndex];
	const next = sections[currIndex + 1];

	if (!next) {
		return { currBg: curr.bg, targetBg: curr.bg, t: 0 };
	}

	const nextTop = next.el.getBoundingClientRect().top;

	// Transition zone: next section enters viewport bottom(ish) → reaches viewport center
	const zoneStart = vh * 1.15;
	const zoneEnd = vh * 0.5;

	if (nextTop >= zoneStart) {
		return { currBg: curr.bg, targetBg: next.bg, t: 0 };
	}

	if (nextTop <= zoneEnd) {
		return { currBg: curr.bg, targetBg: next.bg, t: 1 };
	}

	const scrollProgress = 1 - (nextTop - zoneEnd) / (zoneStart - zoneEnd);
	return { currBg: curr.bg, targetBg: next.bg, t: easeInOut(scrollProgress) };
}

function handleScroll(sections: Section[]) {
	const state = getScrollState(sections);
	if (state) applyBg(state.currBg, state.targetBg, state.t);
}

export function initPaletteTransition(): () => void {
	const sections = getSections();
	let ticking = false;

	function onScroll() {
		if (!ticking) {
			requestAnimationFrame(() => {
				ticking = false;
				handleScroll(sections);
			});
			ticking = true;
		}
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	handleScroll(sections);

	return () => window.removeEventListener('scroll', onScroll);
}
