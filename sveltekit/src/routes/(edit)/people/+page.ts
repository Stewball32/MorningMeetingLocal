import type { PageLoad } from './$types';
import { SchoolBuilder } from '$lib/pb/objects';

export const load = (async () => {
	const people = await SchoolBuilder.getAllPeople();

	return { people };
}) satisfies PageLoad;
