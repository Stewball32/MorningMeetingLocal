<script lang="ts">
	import type {
		ClassDaily,
		GuestAvatar,
		GuestDaily,
		Student,
		StudentDaily,
		Teacher,
		TeacherDaily
	} from '$lib/pb/types';
	import NavArrows from '../NavArrows.svelte';
	import FindTheDate from './FindTheDate.svelte';
	import MonthView from './MonthView.svelte';
	import type { ClassProps } from './_types';

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

	let calendarProps: ClassProps = $state(classDaily.calendar ?? ({} as ClassProps));
	let page = $state(calendarProps?.page ?? 0);
	let currentCheck = $state(classDaily?.calendar?.currentCheck ?? 0);
	let yearGuesses = $state(classDaily?.calendar?.yearGuesses ?? []);
	let monthGuesses = $state(classDaily?.calendar?.monthGuesses ?? []);
	let dayGuesses = $state(classDaily?.calendar?.dayGuesses ?? []);
	let weekdayGuesses = $state(classDaily?.calendar?.weekdayGuesses ?? []);
	let dayOpt;
	let startWithSunday = $state(false);

	let totalSlides = 5; // total number of slides
	const pageLeft = () => {
		if (page > 0) {
			page--;
			updateClassDailySlide('calendar', { page });
		} else slideLeft();
	};
	const pageRight = () => {
		if (page < totalSlides - 1) {
			page++;
			updateClassDailySlide('calendar', { page });
		} else {
			slideRight();
		}
	};
</script>

<NavArrows {classDaily} {page} {totalSlides} {pageLeft} {pageRight} />

{#if page === 0}
	<FindTheDate
		{classDaily}
		{currentCheck}
		{startWithSunday}
		{pageLeft}
		{pageRight}
		{updateClassDailySlide}
	/>
{:else if page === 1}
	<MonthView {classDaily} {startWithSunday} {pageLeft} {pageRight} {updateClassDailySlide} />
{/if}
