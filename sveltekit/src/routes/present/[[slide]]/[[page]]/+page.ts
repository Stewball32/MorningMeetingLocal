import { getCurrentISOString } from '$lib';
import { getAllStudents, getAllTeachers, getStudentDailyMap, getTeacherDailyMap } from '$lib/pb';
import type { Student, Teacher } from '$lib/pb/types';
import type { PageLoad } from './$types';

export const load  = (async ({ params, url }) => {

		const { slide, page } = params;
		const slideNum = parseInt(slide as string) || 0;
		const pageNum = parseInt(page as string) || 0;
		const searchParamData = Object.fromEntries(url.searchParams.entries());

		const todayISOString = getCurrentISOString()
		const students = await getAllStudents()
		const teachers = await getAllTeachers()
		const studentDailyMap = await getStudentDailyMap()
		const teacherDailyMap = await getTeacherDailyMap()

		interface SlideParams {
			slide: number;
			page: number;
			pid?: string; // person id
			//^^ values from url ^^
			[key: string]: any; // other search params
			//vv values generated vv
			person?: Student | Teacher; // person object (student or teacher)
		}
		const slideParams: SlideParams = {
			slide: slideNum,
			page: pageNum,
			...searchParamData,
		}

		if (slideParams?.pid) {
			const pid = slideParams.pid as string;
			const person = students.find((s) => s.id === pid) || teachers.find((t) => t.id === pid);
			if (person) slideParams.person = person;
		}

		return {
			slideParams,
			todayISOString,
			students,
			studentDailyMap,
			teachers,
			teacherDailyMap,
		};
}) satisfies PageLoad;