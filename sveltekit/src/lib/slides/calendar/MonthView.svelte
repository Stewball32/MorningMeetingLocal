<script lang="ts">
	import type { ClassDaily } from '$lib/pb/types';
	import { onMount } from 'svelte';
	import type { Weekday } from './_types';
	import { updateSound } from '$lib/sounds';
	import ResetSlide from '$lib/slides/ResetSlide.svelte';

	interface MonthViewProps {
		classDaily: ClassDaily;
		today: Date;
		todayDay: number;
		calendarGuesses: number[];
		startWithSunday?: boolean;
		weekdayBackgrounds: Record<Weekday, string>;
		pageLeft: () => void;
		pageRight: () => void;
		updateClassDailySlide: (
			column: string,
			partialClassDaily: Partial<ClassDaily>
		) => Promise<void>;
	}

	let {
		classDaily,
		today = new Date(),
		todayDay = today.getDate(),
		calendarGuesses = $bindable([]),
		startWithSunday = $bindable(false),
		weekdayBackgrounds,
		pageLeft = () => {},
		pageRight = () => {},
		updateClassDailySlide = async (column: string, partialClassDaily: Partial<ClassDaily>) => {}
	}: MonthViewProps = $props();

	const currentMonth = today.getMonth();
	const lastMonth = (currentMonth + 11) % 12;
	const nextMonth = (currentMonth + 1) % 12;
	const currentYear = today.getFullYear();
	let daysInMonth: number[] = $state([]);
	let startDay = $state(0);

	const getDaysInMonth = (month: number, year: number): number => {
		return new Date(year, month + 1, 0).getDate();
	};

	let weekdays: Weekday[] = startWithSunday
		? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	const weekdayAbrs = $state(weekdays.map((w) => w.slice(0, 3)));
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

	let selectedCalendar: number | undefined = $derived(calendarGuesses[0]);
	const updateCalendar = async (value: number) => {
		if (selectedCalendar == todayDay) return;
		let updatedCalendarGuesses = calendarGuesses ?? [];
		updatedCalendarGuesses.unshift(value);
		calendarGuesses = updatedCalendarGuesses;
		let partial = {
			...classDaily.calendar,
			calendarGuesses: updatedCalendarGuesses
		};
		let sound = selectedCalendar == todayDay ? 'correct' : 'incorrect';
		updateSound('find-calendar', sound);
		await updateClassDailySlide('calendar', partial);
	};

	const resetCalendar = async () => {
		calendarGuesses = [];
		let partial = {
			...classDaily.calendar,
			calendarGuesses: calendarGuesses
		};
		await updateClassDailySlide('calendar', partial);
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

	const weekdayBorders = (weekday: string) => {
		let wkdyClass = 'z-1 ';
		if (weekday != weekdayAbrs[0]) wkdyClass += ' border-l-2';
		if (weekday != weekdayAbrs[weekdayAbrs.length - 1]) wkdyClass += ' border-r-2';
		return wkdyClass;
	};

	const dayBorders = (day: number) => {
		let dayClass = ' ';
		let weekdayNum = (day - 1 + startDay) % 7;
		// hover background
		dayClass +=
			weekdayNum == currentHovverWeekday ? weekdayBackgrounds[weekdays[weekdayNum]] : 'bg-gray-200';
		if (day + startDay > 7) dayClass += ' border-t-2';
		if ((day + startDay) % 7 != 1) dayClass += ' border-l-2';
		if ((day + startDay) % 7 != 0) dayClass += ' border-r-2';
		let weekRow = Math.floor((daysInMonth.length + startDay) / 7);
		if (day / 7 > 0) dayClass += ' border-t-2 ';
		return dayClass;
	};

	let currentHoverDay = $state(0);
	const hoverDay = (day: number) => {
		if (selectedCalendar == day) return (currentHoverDay = 0);
		currentHoverDay = day;
	};

	let currentHovverWeekday: number | null = $state(null);
	const hoverWeekday = (weekday: number | null) => {
		currentHovverWeekday = weekday;
	};

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowLeft') {
			pageLeft();
		} else if (event.key === 'ArrowRight') {
			if (selectedCalendar != todayDay) return updateCalendar(todayDay);
			pageRight();
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

<ResetSlide onclick={resetCalendar} />

<div class="h-full w-full">
	<div class="flex h-[15%] items-center justify-center">
		<img
			src={`/months/${monthNames[currentMonth]}.png`}
			alt={monthNames[currentMonth]}
			class="h-11/12 m-0 rounded-full p-0"
			onerror={(e) => {
				(e.currentTarget as HTMLImageElement).src = '/months/default.png';
			}}
		/>
		<h2 class="text-size-7 font-bold">{monthNames[currentMonth]} {currentYear}</h2>
	</div>
	<div
		role="presentation"
		onmouseleave={() => hoverWeekday(null)}
		class="flex h-[74%] items-center justify-center"
	>
		<div class={`grid h-full w-[6%] ${gridRows()}  py-[.5%] text-center font-bold`}>
			{#each [null, null, ...Array(Math.ceil((daysInMonth.length + startDay) / 7) - (startDay > 0 ? 1 : 0)).keys()] as i}
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
			class={`grid h-full w-[93%] grid-cols-7 ${gridRows()} rounded-4xl overflow-clip border-4 bg-white text-center`}
		>
			{#each weekdayAbrs as dayName, i}
				<div
					role="columnheader"
					tabindex={i}
					onmouseenter={() => hoverWeekday(i)}
					class={`${weekdayBorders(dayName)} ${weekdayBackgrounds[weekdays[i]]} text-size-5 border-b-2 font-bold`}
				>
					{dayName}
				</div>
			{/each}
			{#each Array(startDay).fill(null) as _}
				<div class="flex items-center justify-center overflow-hidden border bg-gray-200">
					<img
						src={`/months/${monthNames[lastMonth]}.png`}
						alt={monthNames[lastMonth]}
						class=" disabled m-0 h-full rounded-full p-0"
						onerror={(e) => {
							(e.currentTarget as HTMLImageElement).src = '/months/default.png';
						}}
					/>
				</div>
			{/each}
			{#each daysInMonth as day}
				<button
					onmouseenter={() => hoverDay(day)}
					onmouseleave={() => hoverDay(0)}
					onclick={() => updateCalendar(day)}
					disabled={selectedCalendar == todayDay ? false : calendarGuesses.includes(day)}
					class={` ${day == selectedCalendar && selectedCalendar == todayDay ? 'z-2 outline-3 font-black' : ''}
            ${dayBorders(day)} btn relative cursor-pointer select-auto rounded-none border `}
				>
					<span
						class={`${currentHoverDay == day ? 'font-bold' : ''}
              ${day == selectedCalendar && selectedCalendar == todayDay ? 'bg-black text-white' : ''}
              text-size-2 absolute right-[0%] top-0 rounded-bl-xl`}>{day}</span
					>
				</button>
			{/each}
			{#if (startDay + daysInMonth.length) % 7 != 0}
				{#each Array(7 - ((daysInMonth.length + startDay) % 7)).fill(null) as _}
					<div class="flex items-center justify-center overflow-hidden border bg-gray-200">
						<img
							src={`/months/${monthNames[nextMonth]}.png`}
							alt={monthNames[nextMonth]}
							class=" disabled m-0 h-full rounded-full p-0"
							onerror={(e) => {
								(e.currentTarget as HTMLImageElement).src = '/months/default.png';
							}}
						/>
					</div>
				{/each}
			{/if}
		</div>
	</div>
	<div class="flex h-[10%] w-full items-center justify-center">
		{#if selectedCalendar == todayDay}
			<span class="text-size-5 text-center font-bold"
				>Today is {weekdays[(selectedCalendar + startDay - 1) % 7]},
				{monthNames[currentMonth]}
				{todayDay}, {currentYear}!</span
			>
		{:else if selectedCalendar != 0}
			<h1 class="text-size-5 text-center font-bold">Let's find today on the calendar!</h1>
		{/if}
	</div>
</div>
