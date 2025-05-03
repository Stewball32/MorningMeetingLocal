<script lang="ts">
	import type { PageData } from './$types';
	import { pb } from '$lib/pb';
	import type { ClassDaily, GuestDaily, Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import { onDestroy, onMount } from 'svelte';
	import type { RecordSubscription } from 'pocketbase';
	import { updateSound } from '$lib/sounds';
	import Attendance from '$lib/slides/attendance/+slide.svelte';

	let { data }: { data: PageData } = $props();

	const todayISOString = data.todayISOString;
	let classDaily: ClassDaily = $state(data.classDaily);
	let students: Student[] = $state(data.students);
	let teachers: Teacher[] = $state(data.teachers);
	let studentDailyMap: Map<string, StudentDaily> = $state(data.studentDailyMap);
	let teacherDailyMap: Map<string, TeacherDaily> = $state(data.teacherDailyMap);
	let guestDailies: GuestDaily[] = $state(data.guestDailies);
	// let currentPerson: Student | Teacher | undefined = $state(undefined);

	let activeStudents: Student[] = $derived(
		students.some((student) => studentDailyMap.get(student.id)?.here === 'present')
			? students.filter((student) => studentDailyMap.get(student.id)?.here === 'present')
			: students.filter((student) => studentDailyMap.get(student.id)?.here !== 'absent')
	);
	let activeTeachers: Teacher[] = $derived(
		teachers.some((teacher) => teacherDailyMap.get(teacher.id)?.here === 'present')
			? teachers.filter((teacher) => teacherDailyMap.get(teacher.id)?.here === 'present')
			: teachers.filter((teacher) => teacherDailyMap.get(teacher.id)?.here !== 'absent')
	);

	// let searchParams: URLSearchParams = $state(data.searchParams);
	// svelte-ignore state_referenced_locally
	let slide = $state(classDaily.slide ?? 0);
	const clearSlideParams = () => {
		// searchParams = new URLSearchParams();
	};
	onMount(async () => {
		pb.collection('class_dailies').subscribe(classDaily.id, (e: RecordSubscription<ClassDaily>) => {
			console.log('classDaily');
			if (e.record.date !== todayISOString) return;
			console.log('classDaily', e.action, e.record);
			if (e.action === 'update') {
				const newClassDaily = e.record;
				classDaily = newClassDaily;
			}
		});

		pb.collection('student_dailies').subscribe('*', (e: RecordSubscription<StudentDaily>) => {
			if (e.record.date !== todayISOString) return;
			const newStudentDailyMap = new Map(studentDailyMap);
			switch (e.action) {
				case 'create':
					newStudentDailyMap.set(e.record.student, e.record);
					if (e.record.here) updateSound(e.record.student, e.record.here);
					break;
				case 'update':
					const oldRecord = newStudentDailyMap.get(e.record.student);
					newStudentDailyMap.set(e.record.student, e.record);
					if (!e.record.here && oldRecord?.here) {
						updateSound(e.record.student, e.record.here);
					} else if (e.record.here && e.record.here !== oldRecord?.here) {
						updateSound(e.record.student, e.record.here);
					}
					break;
				case 'delete':
					newStudentDailyMap.delete(e.record.student);
					break;
			}
			studentDailyMap = newStudentDailyMap;
		});

		pb.collection('teacher_dailies').subscribe('*', (e: RecordSubscription<TeacherDaily>) => {
			if (e.record.date !== todayISOString) return;
			const newTeacherDailyMap = new Map(teacherDailyMap);
			switch (e.action) {
				case 'create':
					newTeacherDailyMap.set(e.record.teacher, e.record);
					if (e.record.here) updateSound(e.record.teacher, e.record.here);
					break;
				case 'update':
					const oldRecord = newTeacherDailyMap.get(e.record.teacher);
					newTeacherDailyMap.set(e.record.teacher, e.record);
					if (!e.record.here && oldRecord?.here) {
						updateSound(e.record.teacher, e.record.here);
					} else if (e.record.here && e.record.here !== oldRecord?.here) {
						updateSound(e.record.teacher, e.record.here);
					}
					break;
				case 'delete':
					newTeacherDailyMap.delete(e.record.teacher);
					break;
			}
			teacherDailyMap = newTeacherDailyMap;
		});

		pb.collection('guest_dailies').subscribe('*', (e: RecordSubscription<GuestDaily>) => {
			if (e.record.date !== todayISOString) return;
			const newGuestDailies = [...guestDailies];
			switch (e.action) {
				case 'create':
					newGuestDailies.push(e.record);
					break;
				case 'update':
					const index = newGuestDailies.findIndex((g) => g.id === e.record.id);
					if (index !== -1) newGuestDailies[index] = e.record;
					break;
				case 'delete':
					const deleteIndex = newGuestDailies.findIndex((g) => g.id === e.record.id);
					if (deleteIndex !== -1) newGuestDailies.splice(deleteIndex, 1);
					break;
			}
			guestDailies = newGuestDailies;
		});

		onDestroy(() => {
			// sounds multiply if not removed (mainly in dev mode)
			pb.collection('student_dailies').unsubscribe('*');
			pb.collection('teacher_dailies').unsubscribe('*');
			pb.collection('guest_dailies').unsubscribe('*');
		});
	});

	const slideLeft = () => {
		if (slide > 0) slide++;
	};
	const slideRight = () => {
		if (slide < 1) slide--;
	};
</script>

{#if slide === 0}
	<Attendance
		{students}
		{teachers}
		{classDaily}
		{studentDailyMap}
		{teacherDailyMap}
		{guestDailies}
		{slideLeft}
		{slideRight}
	/>
{/if}
