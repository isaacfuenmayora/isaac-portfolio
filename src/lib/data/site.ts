export type PaletteName = 'YI' | 'YI2' | 'MF' | 'MF2' | 'NK' | 'NK2' | 'SG' | 'SG2';

export type NavLink = {
	label: string;
	href: string;
	id?: string;
	external?: boolean;
};

export type Project = {
	slug: string;
	title: string;
	summary: string;
	impact: string;
	tags: string[];
	href: string;
	palette: PaletteName;
};

type ProjectInput = Omit<Project, 'href'> & {
	href?: string;
};

function projectHref(slug: string): string {
	return `/projects#${slug}`; // TODO: should `/projects/${slug}`
}

function createProject(project: ProjectInput): Project {
	return {
		...project,
		href: project.href ?? projectHref(project.slug)
	};
}

export type ExperienceEntry = {
	company: string;
	role: string;
	dates: string;
	highlights: string[];
	palette: PaletteName;
};

export const hero = {
	name: 'Isaac Fuenmayor',
	role: 'Full Stack Software Engineer',
	summary:
		'Rails engineer focused on backend systems, APIs, integrations, and real-time applications.',
	subline: 'Based in Chicago. Building reliable systems and interesting products.',
	palette: 'YI' as const
};

export const projects: Project[] = [
	createProject({
		slug: 'quidquote',
		title: 'QuidQuote',
		summary:
			"A messaging app for splitting costs and tracking balances. I got tired of awkward spreadsheets and tools that didn't fit how I actually wanted to manage shared expenses.",
		impact: 'Built around real-time state, authentication flows, and group balance logic.',
		tags: ['Rails API', 'GraphQL', 'Action Cable', 'Pundit', 'React Native'],
		palette: 'MF'
	}),
	createProject({
		slug: 'wikinetwork',
		title: 'WikiNetwork',
		summary: 'CLI tool for finding navigation paths between Wikipedia pages.',
		impact: 'Focused on algorithmic search and lazy graph expansion over live API data.',
		tags: ['C++', 'Graph Traversal', 'BFS/DFS', 'MediaWiki API'],
		palette: 'NK'
	}),
	createProject({
		slug: 'dsl-compiler',
		title: 'Image DSL Compiler',
		summary: 'Java-based compiler for a custom image-oriented language.',
		impact: 'Designed parsing, AST, semantic analysis, and Java code generation pipeline.',
		tags: ['Java', 'Compiler Design', 'AST', 'Semantic Analysis'],
		palette: 'SG'
	})
];

export const experience: ExperienceEntry[] = [
	{
		company: 'InfoTech',
		role: 'Software Engineer',
		dates: '2022 - 2026',
		highlights: [
			'Worked across a large Rails and Vue codebase used by thousands of contractors and project managers.',
			'Shipped features in reporting, search, integrations, and authorization across backend and frontend.',
			'Spent a lot of time on cross-cutting production bugs where one issue touches the backend, the frontend, and a partner system all at once.',
			'Modernized legacy UI and overhauled the test infrastructure.',
			'Helped make the local dev environment something new engineers could actually set up on day one.'
		],
		palette: 'YI2'
	},
	{
		company: 'Springbig',
		role: 'Software Engineer Intern',
		dates: '2021',
		highlights: [
			'Worked as a liaison between Springbig and external developer teams integrating with our API, helping define how integrations actually worked.',
			'Automated a reporting workflow that had been eating 10+ hours a week of manual effort using Rails, Python, and AWS Lambda.',
			'Wrote a ton of SQL for reporting and data pulls.',
			'Got comfortable debugging integration failures through CloudWatch and API Gateway, which turned into a recurring theme in my career.'
		],
		palette: 'MF2'
	}
];

export const contact = {
	email: 'mailto:hello@hireisaac.dev',
	linkedin: 'https://www.linkedin.com/in/isaacfuenmayora',
	github: 'https://github.com/isaacfuenmayora',
	resume: '/resume',
	cta: "Looking for my next role. If your team works on interesting problems, let's talk!",
	palette: 'SG' as const
};

export const contactLinks: NavLink[] = [
	{ label: 'Email', href: contact.email },
	{ label: 'LinkedIn', href: contact.linkedin, external: true },
	{ label: 'GitHub', href: contact.github, external: true },
	{ label: 'Resume', href: contact.resume, external: true }
];

export const sectionLinks: NavLink[] = [
	{ label: 'Projects', href: '#projects', id: 'projects' },
	{ label: 'Experience', href: '#experience', id: 'experience' },
	{ label: 'Contact', href: '#contact', id: 'contact' }
];

export const topActionLinks: NavLink[] = [
	{ label: 'Resume', href: '/resume', external: true },
	{ label: 'GitHub', href: contact.github, external: true }
];

export const heroLinks: NavLink[] = [
	{ label: 'View Projects', href: '#projects' },
	{ label: 'Contact Me', href: '#contact' },
	{ label: 'Resume', href: '/resume', external: true }
];

export const projectJumpLinks: NavLink[] = projects.map((project) => ({
	label: project.title,
	href: `#project-${project.slug}`,
	id: 'projects'
}));
