<script lang="ts">
	import type { PageData } from './$types';
	import { pb, updateDaily } from '$lib/pb';
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import { onDestroy, onMount } from 'svelte';
	import type { RecordSubscription } from 'pocketbase';
	import { updateSound } from '$lib/sounds';
	import Attendance from '$lib/slides/attendance/+slide.svelte'

	let { data }: { data: PageData } = $props();

	const todayISOString = data.todayISOString;
	let students: Student[] = $state(data.students);
	let teachers: Teacher[] = $state(data.teachers);
	let studentDailyMap: Map<string, StudentDaily> = $state(data.studentDailyMap);
	let teacherDailyMap: Map<string, TeacherDaily> = $state(data.teacherDailyMap);
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

	onMount(async () => {
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
		onDestroy(() => {
			// sounds multiply if not removed (mainly in dev mode)
			pb.collection('student_dailies').unsubscribe('*');
		});
	});

	let slide = $state(0);
	// let page = $state(0);
</script>

{#if slide === 0}
	<Attendance
		todayISOString={todayISOString}
		students={students}
		teachers={teachers}
		studentDailyMap={studentDailyMap}
		teacherDailyMap={teacherDailyMap}
		bind:slide
	/>
{/if}
