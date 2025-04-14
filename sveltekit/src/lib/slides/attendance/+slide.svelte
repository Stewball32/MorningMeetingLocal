<script lang="ts">
	// import type { PageData } from './$types';
	import { pb, updateDaily } from '$lib/pb';
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import { onDestroy, onMount } from 'svelte';
	import type { RecordSubscription } from 'pocketbase';
	import { updateSound } from '$lib/sounds';
	import WhoIsHere from '$lib/slides/attendance/WhoIsHere.svelte';
	import PeopleMath from './PeopleMath.svelte';

	interface SlideProps {
		todayISOString: string;
		students: Student[];
		teachers: Teacher[];
		studentDailyMap: Map<string, StudentDaily>;
		teacherDailyMap: Map<string, TeacherDaily>;
		slide: number;
		// page: number;
	}

	let {
		todayISOString,
		students = $bindable([]),
		teachers = $bindable([]),
		studentDailyMap = $bindable(new Map<string, StudentDaily>()),
		teacherDailyMap = $bindable(new Map<string, TeacherDaily>()),
		slide = $bindable(0),
		// page = $bindable(0),
	}: SlideProps = $props();

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
		await updateDaily(person, { ...daily, here });
	};

	const pageLeft = () => {
		if (page > 0) page--;
	};
	const pageRight = () => {
		if (page < 3) page++;
	};

	let page = $state(0);

</script>


<div
	class="h-1/12 absolute bottom-2 right-2 z-10 flex w-[8%] items-center justify-center gap-1 sm:gap-4"
>
	<button class="text-nav-arrows " onclick={() => page--} disabled={page <= 0}>❮</button>
	<button class="text-nav-arrows " onclick={() => page++} disabled={page >= 3}>❯</button>
</div>

{#if page === 0}
	<WhoIsHere
		people={students}
		dailyMap={studentDailyMap}
		{updateAttendance}
		bind:currentPerson
		title="Let's Take Attendance!"
		subtitle="Which students are here today?"
		prompt="Click on a student's button above."
		{pageLeft}
		{pageRight}
	/>
{:else if page === 1}
<PeopleMath
		peopleOne={students}
		peopleOneName="Students"
		peopleTwo={students.filter((s) => studentDailyMap.get(s.id)?.here === 'absent')}
		peopleTwoMap={studentDailyMap}
		peopleTwoName="Absent"
		mathOperation="subtract"
		resultName="Here"
		title="How Many Students?"
		{pageLeft}
		{pageRight}
	/>
{:else if page === 2}
	<WhoIsHere
		people={teachers}
		dailyMap={teacherDailyMap}
		{updateAttendance}
		bind:currentPerson
		title="Attendance: Part 2!"
		subtitle="Which teachers are here today?"
		prompt="Click on a teacher's button above."
		{pageLeft}
		{pageRight}
	/>
{/if}
