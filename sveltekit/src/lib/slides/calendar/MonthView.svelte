<script lang="ts">
	import type { ClassDaily } from '$lib/pb/types';
	import { onMount } from 'svelte';

	interface MonthViewProps {
		classDaily: ClassDaily;
		startWithSunday?: boolean;
		pageLeft: () => void;
		pageRight: () => void;
		updateClassDailySlide: (
			column: string,
			partialClassDaily: Partial<ClassDaily>
		) => Promise<void>;
	}

	let {
		classDaily,
		startWithSunday = $bindable(false),
		pageLeft = () => {},
		pageRight = () => {},
		updateClassDailySlide = async (column: string, partialClassDaily: Partial<ClassDaily>) => {}
	}: MonthViewProps = $props();

	const today = new Date();
	let currentMonth = today.getMonth();
	let currentYear = today.getFullYear();
	let daysInMonth: number[] = $state([]);
	let startDay = $state(0);
	let selectedCalDay = $state(0);

	const getDaysInMonth = (month: number, year: number): number => {
		return new Date(year, month + 1, 0).getDate();
	};

	const dayNames = startWithSunday
		? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const getStartDayOfMonth = (month: number, year: number): number => {
		const jsDay = new Date(year, month, 1).getDay(); // 0 = Sun ... 6 = Sat
		return startWithSunday
			? jsDay // no remapping needed
			: (jsDay + 6) % 7; // remap so Mon = 0, Tue = 1, ..., Sun = 6
	};

	const generateCalendar = () => {
		const numDays = getDaysInMonth(currentMonth, currentYear);
		startDay = getStartDayOfMonth(currentMonth, currentYear);
		daysInMonth = Array.from({ length: numDays }, (_, i) => i + 1);
	};

	onMount(generateCalendar);

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const ordinals = ['st', 'nd', 'rd', 'th', 'th', 'th'];

	const gridRows = () => {
		type Rows = 4 | 5 | 6;
		let rows = Math.ceil((daysInMonth.length + startDay) / 7);
		const gridRows = {
			4: 'grid-rows-[12%_repeat(4,_1fr)]',
			5: 'grid-rows-[12%_repeat(5,_1fr)]',
			6: 'grid-rows-[12%_repeat(6,_1fr)]'
		};
		return gridRows[rows as Rows];
	};

	const weekdayClass = (weekday: string) => {
		let wkdyClass = 'text-size-5 border-b-2';
		if (weekday != dayNames[0]) wkdyClass += ' border-l-2';
		if (weekday != dayNames[dayNames.length - 1]) wkdyClass += ' border-r-2';
		return wkdyClass;
	};

	const monthDayClass = (day: number) => {
		let dayClass = 'relative cursor-pointer select-auto border hover:bg-gray-100';
		if (day + startDay > 7) dayClass += ' border-t-2';
		if ((day + startDay) % 7 != 1) dayClass += ' border-l-2';
		if ((day + startDay) % 7 != 0) dayClass += ' border-r-2';
		let weekRow = Math.floor((daysInMonth.length + startDay) / 7);
		if (day / 7 > 0) dayClass += ' border-t-2 ';
		return dayClass;
	};
</script>

<div class="h-full w-full">
	<div class="flex h-[15%] items-center justify-center">
		<h2 class="text-size-7 font-bold">{monthNames[currentMonth]} {currentYear}</h2>
	</div>
	<div class="flex h-[74%] items-center justify-center">
		<div class={`grid h-full w-[6%] ${gridRows()}  py-[.5%] text-center font-bold`}>
			{#each [null, ...Array(Math.ceil((daysInMonth.length + startDay) / 7)).keys()] as i}
				{#if i == null}
					<div class=""></div>
				{:else}
					<div class="flex h-full w-full items-center justify-center">
						<span class="text-size-4">{i + 1}</span>
						<span class="text-size-2">{ordinals[i]}</span>
					</div>
				{/if}
			{/each}
		</div>
		<div
			class={`grid h-full w-[93%] grid-cols-7 ${gridRows()} rounded-4xl overflow-clip border-4 bg-white text-center font-bold`}
		>
			{#each dayNames as dayName}
				<div class={weekdayClass(dayName)}>
					{dayName}
				</div>
			{/each}
			{#each Array(startDay).fill(null) as _}
				<div class="border bg-gray-200"></div>
			{/each}
			{#each daysInMonth as day}
				<div class={monthDayClass(day)}>
					<span class="text-size-2 absolute right-[1%] top-0">{day}</span>
				</div>
			{/each}
			{#if (startDay + daysInMonth.length) % 7 != 0}
				{#each Array(7 - ((daysInMonth.length + startDay) % 7)).fill(null) as _}
					<div class="border bg-gray-200"></div>
				{/each}
			{/if}
		</div>
	</div>
	<div class="flex h-[10%] w-full items-center justify-center">
		<h1 class="text-size-5 text-center font-black">Let's find today on the calendar!</h1>
	</div>
</div>
