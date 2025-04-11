import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
import type { PageLoad } from './$types';

const anyPresent = (dailyMap: Map<string, StudentDaily | TeacherDaily>): boolean => {
    return Array.from(dailyMap.values()).some((daily) => daily.here === "present")
}

export const load = (async ( { parent } ) => {
	const parentData = await parent()
	const { students, teachers, studentDailyMap, teacherDailyMap } = parentData

    let studentsActive: Student[] = []
    if ( anyPresent(studentDailyMap) ) {
        studentsActive = students.filter((student) => {
            const daily = studentDailyMap.get(student.id)
            return daily?.here === "present"
        })
    } else {
        studentsActive = students.filter((student) => {
            const daily = studentDailyMap.get(student.id)
            return daily?.here !== "absent"
        })
    }

    let teachersActive: Teacher[] = []
    if ( anyPresent(teacherDailyMap) ) {
        teachersActive = teachers.filter((teacher) => {
            const daily = teacherDailyMap.get(teacher.id)
            return daily?.here === "present"
        })
    }
    else {
        teachersActive = teachers.filter((teacher) => {
            const daily = teacherDailyMap.get(teacher.id)
            return daily?.here !== "absent"
        })
    }

	
    return {
        studentsActive,
        teachersActive,
    };
}) satisfies PageLoad;