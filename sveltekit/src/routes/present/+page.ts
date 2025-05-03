import { getCurrentISOString } from '$lib';
import { getAllStudents, getAllTeachers, getClassDaily, getGuestDailes, getStudentDailyMap, getTeacherDailyMap } from '$lib/pb';
import type { PageLoad } from './$types';

export const load  = (async ({ params, url }) => {

		const todayISOString = getCurrentISOString()
		const classDaily = await getClassDaily()
		const students = await getAllStudents()
		const teachers = await getAllTeachers()
		const studentDailyMap = await getStudentDailyMap()
		const teacherDailyMap = await getTeacherDailyMap()
		const guestDailies = await getGuestDailes()
		
		return {
			todayISOString,
			classDaily,
			students,
			studentDailyMap,
			teachers,
			teacherDailyMap,
			guestDailies,
		};

}) satisfies PageLoad;