import { getClassroomRecordByName } from '$lib/pb/records';
import type { Component } from 'svelte';
import type { PageLoad } from './$types';
import { getClassSlideComponents } from '$lib/slides';
import type {
	StudentInteractComponentProps,
	SlideComponentProps,
	StudentViewComponentProps
} from '$lib/slides';
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
	const studentId = params.id;

	const [deck, teachers, students, guests] = await Promise.all([
		SchoolBuilder.getDeck('Morning Meeting'),
		SchoolBuilder.getClassTeachers(classroom.id),
		SchoolBuilder.getClassStudents(classroom.id),
		SchoolBuilder.getClassGuests(classroom.id)
	]);

	const student = students.find((s) => s.id === studentId);
	if (!student) {
		throw new Error(`Student with ID ${studentId} not found in classroom ${classroom.name}`);
	}

	const todayISO = getCurrentISOString();
	const studentViewComponents: Component<StudentViewComponentProps>[] =
		await deck.getStudentViewComponents();
	const studentInteractComponents: Component<StudentInteractComponentProps>[] =
		await deck.getStudentInteractComponents();
	const [presentation, slides]: [Presentation, Slide[]] = await Promise.all([
		classroom.getPresentation(deck.id, todayISO),
		deck.getSlides()
	]);

	const classroomActivityPromises = deck.resolveIndividualActivityRecords(
		presentation.id,
		classroom.record
	) as Promise<ClassroomActivity[]>;

	const studentActivityPromises = student.resolvePresentationActivityRecords(
		presentation.id,
		deck.slidesIds
	) as Promise<StudentActivity[]>;

	const [classroomActivityArray, studentActivityArray]: [ClassroomActivity[], StudentActivity[]] =
		await Promise.all([classroomActivityPromises, studentActivityPromises]);

	return {
		classroom,
		deck,
		teachers,
		students,
		guests,
		presentation,
		slides,
		studentViewComponents,
		studentInteractComponents,
		classroomActivityArray,
		studentActivityArray
	};
}) satisfies PageLoad;
