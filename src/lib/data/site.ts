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

// TODO: update this placeholder content. maybe pull from somewhere
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
		summary: 'Real-time messaging and shared expense tracking application.',
		impact: 'Built around real-time state, authentication flows, and group balance logic.',
		tags: ['Rails API', 'GraphQL', 'Action Cable', 'React Native'],
		palette: 'MF'
	}),
	createProject({
		slug: 'wikinetwork',
		title: 'WikiNetwork',
		summary: 'C++ CLI tool for finding navigation paths between Wikipedia pages.',
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
		dates: '2022 - Present',
		highlights: [
			'Designed and maintained backend services and APIs powering customer-facing workflows.',
			'Improved reliability by hardening integrations and reducing failure-prone paths.',
			'Partnered cross-functionally to ship features with measurable impact and production stability.'
		],
		palette: 'YI2'
	},
	{
		company: 'Springbig',
		role: 'Software Engineer Intern',
		dates: '2021 - 2022',
		highlights: [
			'Contributed to production code in a fast-moving engineering environment.',
			'Built and refined internal tools and features across backend and web surfaces.',
			'Supported delivery through debugging, testing, and iterative improvements.'
		],
		palette: 'MF2'
	}
];

export const contact = {
	email: 'mailto:isaac@example.com', // TODO: use hireisaac.dev domain for email
	github: 'https://github.com/isaacfuenmayora',
	linkedin: 'https://www.linkedin.com/in/isaacfuenmayora',
	resume: '/resume',
	cta: 'Open to software engineering opportunities. Reach out to talk about backend, product, or systems work.',
	palette: 'NK2' as const
};

export const sectionLinks: NavLink[] = [
	{ label: 'Projects', href: '#projects', id: 'projects' },
	{ label: 'Experience', href: '#experience', id: 'experience' },
	{ label: 'Contact', href: '#contact', id: 'contact' },
	{ label: 'Resume', href: '/resume' }
];

export const topActionLinks: NavLink[] = [
	{ label: 'Resume', href: '/resume' },
	{ label: 'GitHub', href: contact.github, external: true }
];

export const heroLinks: NavLink[] = [
	{ label: 'View Projects', href: '#projects' },
	{ label: 'Resume', href: '/resume' },
	{ label: 'GitHub', href: contact.github, external: true }
];

export const projectJumpLinks: NavLink[] = projects.map((project) => ({
	label: project.title,
	href: `#project-${project.slug}`,
	id: 'projects'
}));
