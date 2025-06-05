<script lang="ts">
	import type { ClassDaily } from '$lib/pb/types';
	import { onMount } from 'svelte';
	import type { Weekday, AstronomyData } from './_types';
	import { updateSound } from '$lib/sounds';
	import ResetSlide from '$lib/slides/ResetSlide.svelte';
	import { getHolidayMap } from '$lib/pb/calendar';
	import type { Holiday } from '$lib/pb/calendar';
	import DayInMonth from './DayInMonth.svelte';
	import { MoonPhase } from 'astronomy-engine';

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

	const getDaysInMonth = (month: number, year: number): number => {
		return new Date(year, month + 1, 0).getDate();
	};

	const currentMonth = today.getMonth();
	const lastMonth = (currentMonth + 11) % 12;
	const nextMonth = (currentMonth + 1) % 12;
	const currentYear = today.getFullYear();
	const daysInMonth: number = $state(getDaysInMonth(currentMonth, currentYear));
	let daysInLastMonth: number = $state(
		getDaysInMonth(lastMonth, lastMonth == 11 ? currentYear - 1 : currentYear)
	);
	let daysInNextMonth: number = $state(
		getDaysInMonth(nextMonth, nextMonth == 0 ? currentYear + 1 : currentYear)
	);
	let startDay = $state(0);
	let holidayMap: Map<number, Holiday[]> = $state(new Map());

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

	// object, Key: day of the month, Value: MoonPhaseData
	const astronomyData: Record<number, AstronomyData[]> = $state({});

	function getPhaseIndex(rawAngle: number): number {
		const normalized = ((rawAngle % 360) + 360) % 360; // in case of negative angles
		const idx = Math.round(normalized / 45) % 8;
		return idx;
	}
	const updateMoonChanges = () => {
		const moonImgDir = `/moons/`;
		const moonPhaseArray = [
			['New Moon', 'new-moon.png'],
			['Waxing Crescent', 'waxing-crescent.png'],
			['First Quarter', 'first-quarter.png'],
			['Waxing Gibbous', 'waxing-gibbous.png'],
			['Full Moon', 'full-moon.png'],
			['Waning Gibbous', 'waning-gibbous.png'],
			['Last Quarter', 'last-quarter.png'],
			['Waning Crescent', 'waning-crescent.png']
		];
		// If you don’t want to compare day 1 to the previous month's last day, start at day = 2:
		for (let day = 1; day <= daysInMonth; day++) {
			const today = new Date(currentYear, currentMonth, day);
			const todayAngle = MoonPhase(today);
			const phaseIndex = getPhaseIndex(todayAngle);

			// If day > 1, compare to yesterday in *this same month*; otherwise skip
			if (day > 1) {
				const yesterday = new Date(currentYear, currentMonth, day - 1);
				const yesterdayIndex = getPhaseIndex(MoonPhase(yesterday));
				if (phaseIndex === yesterdayIndex) {
					continue; // no change in phase from yesterday → skip
				}
			}
			// (Optional) If you really want to record a change on day 1 vs. the *previous* month,
			// you can remove the `day > 1` check and always compare.

			const [phaseName, phaseImage] = moonPhaseArray[phaseIndex];
			// console.log(`Day ${day} (${today.toDateString()}): ${phaseName} (${phaseImage})`);
			const moonPhaseData: AstronomyData = {
				name: phaseName,
				imgSrc: moonImgDir + phaseImage
			};
			astronomyData[day] = astronomyData[day] ??= [];
			astronomyData[day].push(moonPhaseData);
		}
		console.log('Astronomy Data:', astronomyData);
	};

	const generateCalendar = async () => {
		// const numDays = getDaysInMonth(currentMonth, currentYear);
		startDay = getStartDayOfMonth(currentMonth, currentYear);
		const newHolidayMap = await getHolidayMap(currentYear, currentMonth);
		holidayMap = newHolidayMap;
		console.log('Holiday Map:', holidayMap);
	};

	updateMoonChanges();

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
		let rows = Math.ceil((daysInMonth + startDay) / 7);
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

	const getDayClass = (day: number) => {
		let dayClass = ' ';
		let weekdayNum = (day - 1 + startDay) % 7;
		// hover background
		dayClass +=
			weekdayNum == currentHoverWeekday ? weekdayBackgrounds[weekdays[weekdayNum]] : 'bg-gray-200';
		if (day + startDay > 7) dayClass += ' border-t-2';
		if ((day + startDay) % 7 != 1) dayClass += ' border-l-2';
		if ((day + startDay) % 7 != 0) dayClass += ' border-r-2';
		let weekRow = Math.floor((daysInMonth + startDay) / 7);
		if (day / 7 > 0) dayClass += ' border-t-2 ';
		return dayClass;
	};

	let currentHoverDay = $state(0);
	const hoverDay = (day: number) => {
		if (selectedCalendar == day) return (currentHoverDay = 0);
		currentHoverDay = day;
	};

	let currentHoverWeekday: number | null = $state(null);
	const hoverWeekday = (weekday: number | null) => {
		currentHoverWeekday = weekday;
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
				(e.currentTarget as HTMLImageElement).src = '/defaults/calendar.png';
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
			{#each [...Array(startDay > 1 ? 2 : 1).fill(null), ...Array(Math.ceil((daysInMonth + startDay) / 7) - (startDay > 0 ? 1 : 0)).keys()] as i}
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
			{#each Array(startDay).fill(null) as _, i}
				<div
					class="relative flex select-none items-center justify-center overflow-hidden border bg-gray-200"
				>
					<span class={`text-size-0 absolute right-[0%] top-0 rounded-bl-xl italic text-gray-500`}>
						{daysInLastMonth - startDay + i + 1}
					</span>

					<span
						class="text-size-0 absolute top-[25%] w-full truncate text-center italic text-gray-500"
					>
						{monthNames[lastMonth]}
					</span>
					<img
						src={`/months/${monthNames[lastMonth]}.png`}
						alt={monthNames[lastMonth]}
						class="disabled m-0 h-full rounded-full p-0 opacity-15"
						onerror={(e) => {
							(e.currentTarget as HTMLImageElement).src = '/defaults/calendar.png';
						}}
					/>
				</div>
			{/each}
			{#each Array.from({ length: daysInMonth }, (_, i) => i + 1) as day}
				<DayInMonth
					{day}
					month={monthNames[currentMonth]}
					year={currentYear}
					holidays={holidayMap.get(day) ?? []}
					astronomyData={astronomyData[day] ?? []}
					{currentHoverDay}
					inPast={todayDay < day}
					inCurrentMonth={currentMonth == today.getMonth()}
					wasSelected={selectedCalendar == day}
					isToday={day == todayDay}
					todayChosen={selectedCalendar == todayDay}
					isDisabled={selectedCalendar != todayDay && calendarGuesses.includes(day)}
					onHover={hoverDay}
					onClick={updateCalendar}
					{getDayClass}
				/>
			{/each}
			{#if (startDay + daysInMonth) % 7 != 0}
				{#each Array(7 - ((daysInMonth + startDay) % 7)).fill(null) as _, i}
					<div
						class="relative flex select-none items-center justify-center overflow-hidden border bg-gray-200"
					>
						<span
							class={`text-size-0 absolute right-[0%] top-0 rounded-bl-xl px-[2%] italic leading-none text-gray-500`}
						>
							{i + 1}
						</span>

						<span
							class="text-size-0 absolute top-[25%] w-full truncate text-center italic text-gray-500"
						>
							{monthNames[nextMonth]}
						</span>
						<img
							src={`/months/${monthNames[lastMonth]}.png`}
							alt={monthNames[lastMonth]}
							class="disabled m-0 h-full rounded-full p-0 opacity-15"
							onerror={(e) => {
								(e.currentTarget as HTMLImageElement).src = '/defaults/calendar.png';
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
