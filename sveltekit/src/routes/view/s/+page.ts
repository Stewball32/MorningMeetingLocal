import { SchoolBuilder, Classroom } from '$lib/pb/objects';
import type { PageLoad } from './$types';

export const load = (async ({ params, url }) => {
	const classroom: Classroom = await SchoolBuilder.getClassroom('Caseys Class');
	const students = await SchoolBuilder.getClassStudents(classroom.id);

	return {
		classroom,
		students
	};
}) satisfies PageLoad;
