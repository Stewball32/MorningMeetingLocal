import { ClassroomBuilder, Classroom } from '$lib/pb/objects';
import type { PageLoad } from './$types';

export const load = (async ({ params, url }) => {
	const classroom: Classroom = await ClassroomBuilder.getClassroom('Caseys Class');
	const students = await ClassroomBuilder.getClassStudents(classroom.id);

	return {
		classroom,
		students
	};
}) satisfies PageLoad;
