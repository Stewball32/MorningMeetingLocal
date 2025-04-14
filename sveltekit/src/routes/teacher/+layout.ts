import { getAllStudents, getAllTeachers, getStudentDailyMap, getTeacherDailyMap } from '$lib/pb';
import { getCurrentISOString } from '$lib';
import type { LayoutLoad } from './$types';

export const load = (async () => {
    
    const todayISOString = getCurrentISOString()
    const students = await getAllStudents()
    const teachers = await getAllTeachers()
    const studentDailyMap = await getStudentDailyMap()
    const teacherDailyMap = await getTeacherDailyMap()

    return {
        todayISOString,
        students,
        studentDailyMap,
        teachers,
        teacherDailyMap,
    };
}) satisfies LayoutLoad;