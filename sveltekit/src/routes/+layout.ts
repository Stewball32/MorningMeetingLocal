import { getAllStudents, getAllTeachers } from '$lib/pb';
import type { Student, Teacher } from '$lib/pb/types';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load = (async ({ data }) => {

    return {
    };
}) satisfies LayoutLoad;

