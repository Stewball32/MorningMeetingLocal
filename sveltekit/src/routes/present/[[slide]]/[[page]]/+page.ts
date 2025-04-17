import { getCurrentISOString } from '$lib';
import { getAllStudents, getAllTeachers, getStudentDailyMap, getTeacherDailyMap } from '$lib/pb';
import type { Student, Teacher } from '$lib/pb/types';
import type { PageLoad } from './$types';

export const load  = (async ({ params, url }) => {


		const todayISOString = getCurrentISOString()
		const students = await getAllStudents()
		const teachers = await getAllTeachers()
		const studentDailyMap = await getStudentDailyMap()
		const teacherDailyMap = await getTeacherDailyMap()
		
		const { slide, page } = params;
		const { searchParams } = url;
		searchParams.set('page', page as string);

		return {
			slide: parseInt(slide as string) || 0,
			// page: parseInt(page as string) || 0,
			searchParams: url.searchParams,
			todayISOString,
			students,
			studentDailyMap,
			teachers,
			teacherDailyMap,
		};
}) satisfies PageLoad;