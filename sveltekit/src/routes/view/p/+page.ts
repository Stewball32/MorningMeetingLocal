import { getClassroomRecordByName } from '$lib/pb/records';
import type { Component } from 'svelte';
import type { PageLoad } from './$types';
import { getClassSlideComponents } from '$lib/slides';
import type { SlideComponentProps } from '$lib/slides';
import {
	Classroom,
	ClassroomActivity,
	GuestActivity,
	Presentation,
	Slide,
	StudentActivity,
	TeacherActivity,
	SchoolBuilder
} from '$lib/pb/objects';
import { getCurrentISOString } from '$lib';

export const load = (async ({ params, url }) => {
	const classroom: Classroom = await SchoolBuilder.getClassroom('Caseys Class');
	const [deck, teachers, students, guests] = await Promise.all([
		SchoolBuilder.getDeck('Morning Meeting'),
		SchoolBuilder.getClassTeachers(classroom.id),
		SchoolBuilder.getClassStudents(classroom.id),
		SchoolBuilder.getClassGuests(classroom.id)
	]);

	const todayISO = getCurrentISOString();
	const slideComponents: Component<SlideComponentProps>[] = await deck.getClassSlideComponents();
	const [presentation, slides]: [Presentation, Slide[]] = await Promise.all([
		classroom.getPresentation(deck.id, todayISO),
		deck.getSlides()
	]);

	const classroomActivityPromises = deck.resolveIndividualActivityRecords(
		presentation.id,
		classroom.record
	) as Promise<ClassroomActivity[]>;

	const guestActivityPromises: Array<Promise<GuestActivity[]>> = [];
	guests.forEach(async (guest) => {
		guestActivityPromises.push(
			guest.resolvePresentationActivityRecords(presentation.id, deck.slidesIds)
		);
	});

	const studentActivityPromises: Array<Promise<StudentActivity[]>> = [];
	students.forEach(async (student) => {
		studentActivityPromises.push(
			student.resolvePresentationActivityRecords(presentation.id, deck.slidesIds)
		);
	});

	const teacherActivityPromises: Array<Promise<TeacherActivity[]>> = [];
	teachers.forEach(async (teacher) => {
		teacherActivityPromises.push(
			teacher.resolvePresentationActivityRecords(presentation.id, deck.slidesIds)
		);
	});

	const [
		classroomActivityArray,
		guestActivityArrays,
		studentActivityArrays,
		teacherActivityArrays
	]: [ClassroomActivity[], GuestActivity[][], StudentActivity[][], TeacherActivity[][]] =
		await Promise.all([
			classroomActivityPromises,
			await Promise.all(guestActivityPromises),
			await Promise.all(studentActivityPromises),
			await Promise.all(teacherActivityPromises)
		]);

	const peopleActivityMaps: Map<string, GuestActivity | StudentActivity | TeacherActivity>[] = [];
	for (const [i, _] of slides.entries()) {
		const activityMap = new Map<string, GuestActivity | StudentActivity | TeacherActivity>();
		guestActivityArrays.forEach((guestArray) => {
			const guestActivity = guestArray[i];
			activityMap.set(guestActivity.guestId, guestActivity);
		});
		for (const studentArray of studentActivityArrays) {
			const studentActivity = studentArray[i];
			activityMap.set(studentActivity.studentId, studentActivity);
		}
		teacherActivityArrays.forEach((teacherArray) => {
			const teacherActivity = teacherArray[i];
			activityMap.set(teacherActivity.teacherId, teacherActivity);
		});
		peopleActivityMaps.push(activityMap);
	}

	return {
		classroom,
		deck,
		teachers,
		students,
		guests,
		presentation,
		slides,
		slideComponents,
		classroomActivityArray,
		peopleActivityMaps
	};
}) satisfies PageLoad;
