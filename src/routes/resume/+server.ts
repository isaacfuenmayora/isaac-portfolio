import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	redirect(308, '/Isaac_Fuenmayor_Public_Resume.pdf');
};
