<script lang="ts">
	import type { PageData } from './$types';
	import { pb, updatePersonDaily } from '$lib/pb';
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import { onDestroy, onMount } from 'svelte';
	import type { RecordSubscription } from 'pocketbase';
	import { updateSound } from '$lib/sounds';
	import Attendance from './Attendance.svelte';

	let { data }: { data: PageData } = $props();

	const todayISOString = data.todayISOString;
	let students: Student[] = $state(data.students);
	let teachers: Teacher[] = $state(data.teachers);
	let studentDailyMap: Map<string, StudentDaily> = $state(data.studentDailyMap);
	let teacherDailyMap: Map<string, TeacherDaily> = $state(data.teacherDailyMap);
	let currentPerson: Student | Teacher | undefined = $state(undefined);

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

	const updateAttendance = async (person: Student | Teacher | undefined, isHere: boolean) => {
		if (!person) {
			console.error('No person provided to update attendance.');
			return;
		}
		let dailyMap = person.collectionName === 'students' ? studentDailyMap : teacherDailyMap;
		let daily = dailyMap.get(person.id);
		let here: 'present' | 'absent' | '' = '';
		switch (daily?.here) {
			case 'present':
				here = isHere ? '' : 'absent';
				break;
			case 'absent':
				here = isHere ? 'present' : '';
				break;
			default:
				here = isHere ? 'present' : 'absent';
				break;
		}
		await updatePersonDaily(person, { ...daily, here });
	};

	let slide = $state(0);
	const slideLeft = () => {
		if (slide > 0) slide--;
	};
	const slideRight = () => {
		if (slide < 4) slide++;
	};

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			slideLeft();
		} else if (event.key === 'ArrowRight') {
			slideRight();
		}
	}

</script>

<svelte:window on:keydown|preventDefault={onKeydown} />
<!-- <div class="h-2/12 absolute top-0 flex w-full justify-between">
	<div class="flex h-full w-1/12 items-center justify-center contain-strict">
		<button
			onclick={slideLeft}
			disabled={slide <= 0}
			class="btn text-question aspect-square w-full overflow-hidden"
		>
			⬅️
		</button>
	</div>
	<div class="flex h-full w-1/12 items-center justify-center contain-strict">
		<button
			onclick={slideRight}
			disabled={slide >= 4}
			class="btn text-question aspect-square w-full overflow-hidden"
		>
			➡️
		</button>
	</div>
</div> -->

<div
	class="h-1/12 absolute bottom-2 right-2 z-10 flex w-[8%] items-center justify-center gap-1 sm:gap-4 bg-red-500 "
>
	<button class="text-nav-arrows " onclick={() => slide--} disabled={slide <= 0}>❮</button>
	<button class="text-nav-arrows " onclick={() => slide++} disabled={slide >= 4}>❯</button>
</div>

{#if slide === 0}
	<Attendance
		people={students}
		dailyMap={studentDailyMap}
		{updateAttendance}
		bind:currentPerson
		title="Let's Take Attendance!"
		subtitle="Which students are here today?"
		prompt="Click on a student's button above."
	/>
{:else if slide === 1}
	<Attendance
		people={teachers}
		dailyMap={teacherDailyMap}
		{updateAttendance}
		bind:currentPerson
		title="Attendance: Part 2!"
		subtitle="Which teachers are here today?"
		prompt="Click on a teacher's button above."
	/>
{/if}
