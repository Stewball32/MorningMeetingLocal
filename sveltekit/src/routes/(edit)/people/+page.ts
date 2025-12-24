import type { PageLoad } from './$types';
import { SchoolBuilder } from '$lib/pb/objects';

export const load = (async () => {
	const [classrooms, people] = await Promise.all([
		SchoolBuilder.getAllClassrooms(),
		SchoolBuilder.getAllPeople()
	]);
	return { classrooms, people };
}) satisfies PageLoad;
