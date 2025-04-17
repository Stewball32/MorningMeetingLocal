<script lang="ts">
	// import type { PageData } from './$types';
	import { pb, updateDaily } from '$lib/pb';
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import { onDestroy, onMount } from 'svelte';
	import type { RecordSubscription } from 'pocketbase';
	import { updateSound } from '$lib/sounds';
	import WhoIsHere from '$lib/slides/attendance/WhoIsHere.svelte';
	import PeopleMath from './PeopleMath.svelte';
	import { makeSearchParams } from '$lib';

	interface SlideProps {
		todayISOString: string;
		students: Student[];
		teachers: Teacher[];
		studentDailyMap: Map<string, StudentDaily>;
		teacherDailyMap: Map<string, TeacherDaily>;
		searchParams: URLSearchParams;
		slideLeft: () => void;
		slideRight: () => void;
		clearSearchParams?: () => void;
		updateNavUrl: (page: number, searchParams: URLSearchParams) => void;
	}

	let {
		todayISOString,
		students = $bindable([]),
		teachers = $bindable([]),
		studentDailyMap = $bindable(new Map<string, StudentDaily>()),
		teacherDailyMap = $bindable(new Map<string, TeacherDaily>()),
		searchParams = $bindable(new URLSearchParams()),
		slideLeft = () => {},
		slideRight = () => {},
		clearSearchParams = () => {},
		updateNavUrl,
	}: SlideProps = $props();

	let currentPerson: Student | Teacher | undefined = $state(undefined);
	let page = $state(parseInt(searchParams.get("page") as string) || 0);

	let totalStudentsGuess: number | undefined = $state(undefined);
	let absentStudentsGuess: number | undefined = $state(undefined);
	let presentStudentsGuess: number | undefined = $state(undefined);
	let hintPresentStudents: boolean = $state(false);
	let presentStudentsGuessTwo: number | undefined = $state(undefined);
	let presentTeachersGuess: number | undefined = $state(undefined);
	let totalPeopleGuess: number | undefined = $state(undefined);
	let hintTotalPeople: boolean = $state(false);

	onMount(async () => {
		const pid = searchParams.get('pid');
		console.log('Mounting attendance slide with pid:', pid);
		if (pid) {
			const person = students.find((s) => s.id === pid) || teachers.find((t) => t.id === pid);
			if (person) {
				currentPerson = person;
			}
		}
		const num1 = searchParams.get('num1');
		const num2 = searchParams.get('num2');
		const result = searchParams.get('result');
		const hint = searchParams.get('hint');
		if (page === 1) {
			if (num1) totalStudentsGuess = parseInt(num1) || undefined;
			if (num2) absentStudentsGuess = parseInt(num2) || undefined;
			if (result) presentStudentsGuess = parseInt(result) || undefined;
			if (hint) hintPresentStudents = hint === 'true';
		} else if (page === 3) {
			if (num1) presentStudentsGuessTwo = parseInt(num1) || undefined;
			if (num2) presentTeachersGuess = parseInt(num2) || undefined;
			if (result) totalPeopleGuess = parseInt(result) || undefined;
			if (hint) hintTotalPeople = hint === 'true';
		}
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

	const setNavUrl = (params: Record<string, string | number | (string | number)[] | null | undefined>) => {
		const searchParams = makeSearchParams(params);
		updateNavUrl(page, searchParams);		
	}

	const pageLeft = () => {
		if (page > 0) page--;
	};
	const pageRight = () => {
		if (page < 3) page++;
	};
</script>

<div
	class="h-1/12 absolute bottom-2 right-2 z-10 flex w-[8%] items-center justify-center gap-1 sm:gap-4"
>
	<button class="text-nav-arrows" onclick={pageLeft} disabled={page <= 0}>❮</button>
	<button class="text-nav-arrows" onclick={pageRight} disabled={page >= 3}>❯</button>
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
		{setNavUrl}
	/>
{:else if page === 1}
	<PeopleMath
		peopleOne={students}
		peopleOneName="Students"
		bind:peopleOneGuess={totalStudentsGuess}
		peopleTwo={students.filter((s) => studentDailyMap.get(s.id)?.here === 'absent')}
		peopleTwoMap={studentDailyMap}
		peopleTwoName="Absent"
		bind:peopleTwoGuess={absentStudentsGuess}
		mathOperation="subtract"
		resultMap={studentDailyMap}
		resultName="Here"
		bind:resultGuess={presentStudentsGuess}
		title="How Many Students?"
		{pageLeft}
		{pageRight}
		{setNavUrl}
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
		{setNavUrl}
	/>
{:else if page === 3}
	<PeopleMath
		peopleOne={students.filter((s) => studentDailyMap.get(s.id)?.here === 'present')}
		peopleOneName="Students"
		bind:peopleOneGuess={presentStudentsGuessTwo}
		peopleTwo={teachers.filter((s) => teacherDailyMap.get(s.id)?.here === 'present')}
		peopleTwoName="Teachers"
		bind:peopleTwoGuess={presentTeachersGuess}
		mathOperation="add"
		resultName="Total"
		bind:resultGuess={totalPeopleGuess}
		title="How Many People?"
		{pageLeft}
		{pageRight}
		{setNavUrl}
	/>
{/if}
