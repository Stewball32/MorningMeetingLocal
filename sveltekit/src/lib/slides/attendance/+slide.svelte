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
	import type { ClassProps, MathClassProps } from './_types';
	import PeopleAddition from './PeopleAddition.svelte';
	import PeopleSubtraction from './PeopleSubtraction.svelte';
	import GuestCheck from './GuestCheck.svelte';
	import NavArrows from '../NavArrows.svelte';

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
		updateClassDailySlide: (
			column: string,
			partialClassDaily: Partial<ClassDaily>
		) => Promise<void>;
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
		slideRight = () => {},
		updateClassDailySlide = async (column: string, partialClassDaily: Partial<ClassDaily>) => {}
	}: SlideProps = $props();

	let currentPerson: Student | Teacher | undefined = $state(undefined);
	let attendanceDaily = $derived(classDaily.attendance ?? ({} as ClassProps));
	let page = $state(classDaily?.attendance?.page ?? 0);
	let studentMath: MathClassProps = $derived(attendanceDaily.studentMath || ({} as MathClassProps));
	let peopleMath: MathClassProps = $derived(attendanceDaily.peopleMath || ({} as MathClassProps));
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

	let totalSlides = 5; // total number of slides
	const pageLeft = () => {
		if (page > 0) {
			page--;
			updateClassDailySlide('attendance', { page });
		} else slideLeft();
	};
	const pageRight = () => {
		if (page < totalSlides - 1) {
			page++;
			updateClassDailySlide('attendance', { page });
		} else {
			slideRight();
		}
	};
</script>

<NavArrows {classDaily} {page} {totalSlides} leftDisabled={page == 0} {pageLeft} {pageRight} />

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
		{updateClassDailySlide}
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
		{updateClassDailySlide}
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
		{updateClassDailySlide}
	/>
{:else if page === 3}
	<GuestCheck
		{hasGuests}
		{guestDailies}
		{welcomeGuests}
		{guestAvatarMap}
		{pageLeft}
		{pageRight}
		{updateClassDailySlide}
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
		{updateClassDailySlide}
	/>
{/if}
