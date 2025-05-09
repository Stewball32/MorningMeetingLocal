<script lang="ts">
	import { updateClassDaily, updatePersonDaily } from '$lib/pb';
	import type {
		ClassDaily,
		GuestAvatar,
		GuestDaily,
		Student,
		StudentDaily,
		Teacher,
		TeacherDaily
	} from '$lib/pb/types';
	import { onMount } from 'svelte';
	import WhoIsHere from '$lib/slides/attendance/WhoIsHere.svelte';
	import type { ClassProps, MathPageProps } from './_types';
	import PeopleAddition from './PeopleAddition.svelte';
	import PeopleSubtraction from './PeopleSubtraction.svelte';
	import GuestCheck from './GuestCheck.svelte';

	interface SlideProps {
		students: Student[];
		teachers: Teacher[];
		classDaily: ClassDaily;
		studentDailyMap: Map<string, StudentDaily>;
		teacherDailyMap: Map<string, TeacherDaily>;
		guestDailies: GuestDaily[];
		guestAvatarMap: Map<string, GuestAvatar>;
		slideLeft: () => void;
		slideRight: () => void;
	}

	let {
		students = $bindable([]),
		teachers = $bindable([]),
		classDaily = $bindable({} as ClassDaily),
		studentDailyMap = $bindable(new Map<string, StudentDaily>()),
		teacherDailyMap = $bindable(new Map<string, TeacherDaily>()),
		guestDailies = $bindable([]),
		guestAvatarMap = $bindable(new Map<string, GuestAvatar>()),
		slideLeft = () => {},
		slideRight = () => {}
	}: SlideProps = $props();

	let currentPerson: Student | Teacher | undefined = $state(undefined);
	let attendanceDaily = $derived(classDaily.attendance ?? ({} as ClassProps));
	let page = $state(classDaily?.attendance?.page ?? 0);
	let studentMath: MathPageProps = $derived(attendanceDaily.studentMath || ({} as MathPageProps));
	let peopleMath: MathPageProps = $derived(attendanceDaily.peopleMath || ({} as MathPageProps));
	// svelte-ignore state_referenced_locally
	let hasGuests: boolean | undefined = $state(attendanceDaily.hasGuests ?? undefined);
	// svelte-ignore state_referenced_locally
	let welcomeGuests: boolean | undefined = $state(attendanceDaily.welcomeGuests ?? undefined);

	onMount(async () => {
		const personId = attendanceDaily.currentPerson; // id string
		if (personId) {
			const person =
				students.find((s) => s.id === personId) || teachers.find((t) => t.id === personId);
			if (person) {
				currentPerson = person;
			}
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
		await updatePersonDaily(person, { ...daily, here });
	};

	const updateClassDailyAttendance = async (partialClassDailyAttendance: Partial<ClassProps>) => {
		const newClassDaily: Partial<ClassDaily> = {
			attendance: {
				...classDaily.attendance,
				...partialClassDailyAttendance
			}
		};
		await updateClassDaily(newClassDaily);
	};

	let totalSlides = 5; // total number of slides
	const pageLeft = () => {
		if (page > 0) {
			page--;
			updateClassDailyAttendance({ page });
		}
	};
	const pageRight = () => {
		if (page < totalSlides - 1) {
			page++;
			updateClassDailyAttendance({ page });
		}
	};
</script>

<div
	class="h-1/12 absolute bottom-2 right-2 z-10 flex w-[8%] items-center justify-center gap-1 sm:gap-4"
>
	<button class="text-nav-arrows" onclick={pageLeft} disabled={page <= 0}>❮</button>
	<button class="text-nav-arrows" onclick={pageRight} disabled={page >= totalSlides - 1}>❯</button>
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
		{updateClassDailyAttendance}
	/>
{:else if page === 1}
	<PeopleSubtraction
		peopleTogetherName="Students"
		peopleSubtracted={students.filter((s) => studentDailyMap.get(s.id)?.here === 'absent')}
		peopleSubtractedName="Absent"
		peopleRemaining={students.filter((s) => studentDailyMap.get(s.id)?.here === 'present')}
		peopleRemainingName="Here"
		title="How Many Students?"
		mathProps={studentMath}
		mathPropsName="studentMath"
		{pageLeft}
		{pageRight}
		{updateClassDailyAttendance}
	/>
	<!-- <PeopleMath
		peopleOne={students}
		peopleOneName="Students"
		peopleTwo={students.filter((s) => studentDailyMap.get(s.id)?.here === 'absent')}
		peopleTwoMap={studentDailyMap}
		peopleTwoName="Absent"
		mathOperation="subtract"
		resultMap={studentDailyMap}
		resultName="Here"
		title="How Many Students?"
		mathProps={studentMath}
		mathPropsName="studentMath"
		{pageLeft}
		{pageRight}
		{updateClassDailyAttendance}
	/> -->
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
		{updateClassDailyAttendance}
	/>
{:else if page === 3}
	<GuestCheck
		{hasGuests}
		{guestDailies}
		{welcomeGuests}
		{guestAvatarMap}
		{pageLeft}
		{pageRight}
		{updateClassDailyAttendance}
	/>
{:else if page === 4}
	<PeopleAddition
		peopleOne={students.filter((s) => studentDailyMap.get(s.id)?.here === 'present')}
		peopleOneName="Students"
		peopleTwo={teachers
			.filter((s) => teacherDailyMap.get(s.id)?.here === 'present')
			.concat(guestDailies)}
		peopleTwoName="Teachers"
		resultName="Total"
		title="How Many People?"
		mathProps={peopleMath}
		mathPropsName="peopleMath"
		{guestAvatarMap}
		{pageLeft}
		{pageRight}
		{updateClassDailyAttendance}
	/>
{/if}

<!-- <PeopleMath
		peopleOne={students.filter((s) => studentDailyMap.get(s.id)?.here === 'present')}
		peopleOneName="Students"
		peopleTwo={teachers.filter((s) => teacherDailyMap.get(s.id)?.here === 'present')}
		peopleTwoName="Teachers"
		mathOperation="add"
		resultName="Total"
		title="How Many People?"
		mathProps={peopleMath}
		mathPropsName="peopleMath"
		{pageLeft}
		{pageRight}
		{updateClassDailyAttendance}
	/> -->
