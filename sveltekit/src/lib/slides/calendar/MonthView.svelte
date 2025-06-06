<script lang="ts">
	import type { ClassDaily } from '$lib/pb/types';
	import { onMount } from 'svelte';
	import type { Weekday, AstronomyData } from './_types';
	import { updateSound } from '$lib/sounds';
	import ResetSlide from '$lib/slides/ResetSlide.svelte';
	import { getHolidayMap as getObservationMap } from '$lib/pb/calendar';
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
	let astronomyData: Record<number, AstronomyData[]> = $state({});
	const moonImgDir = `/moons/`;
	// Lookup table: index 0 = New Moon, 1 = Waxing Crescent, …, 7 = Waning Crescent
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
	const lastDayofZodiac = [19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
	const zodiacDir = '/zodiac/';
	const zodiacArray = [
		['Capricorn', 'capricorn.png'],
		['Aquarius', 'aquarius.png'],
		['Pisces', 'pisces.png'],
		['Aries', 'aries.png'],
		['Taurus', 'taurus.png'],
		['Gemini', 'gemini.png'],
		['Cancer', 'cancer.png'],
		['Leo', 'leo.png'],
		['Virgo', 'virgo.png'],
		['Libra', 'libra.png'],
		['Scorpio', 'scorpio.png'],
		['Sagittarius', 'sagittarius.png']
	];

	const updateAstronomy = () => {
		const newAstronomyData: Record<number, AstronomyData[]> = {};

		const getPhaseIndex = (rawAngle: number) => {
			// Normalize angle into [0, 360), then bucket into one of 8 octants
			const normalized = ((rawAngle % 360) + 360) % 360;
			return Math.round(normalized / 45) % 8;
		};

		const getZodiacSign = (date: Date) => {
			const month = date.getMonth();
			const day = date.getDate();
			const idx = day > lastDayofZodiac[month] ? month + (1 % 12) : month;
			return zodiacArray[idx];
		};

		// 1) Compute the phase index of the last day of the previous month:
		const lastOfPrevMonth = new Date(currentYear, currentMonth, 0); // day 0 = last day of previous month
		let prevMoonIdx = getPhaseIndex(MoonPhase(lastOfPrevMonth));
		let prevZodiacSign = getZodiacSign(lastOfPrevMonth);

		// 2) Loop through each day of the current month, compute phase index, and record if it changes
		for (let day = 1; day <= daysInMonth; day++) {
			const loopDate = new Date(currentYear, currentMonth, day);
			const loopMoonIdx = getPhaseIndex(MoonPhase(loopDate));
			if (loopMoonIdx !== prevMoonIdx) {
				// We have a phase transition on "day"
				const [phaseName, fileName] = moonPhaseArray[loopMoonIdx];
				const entry: AstronomyData = {
					name: phaseName,
					imgSrc: moonImgDir + fileName
				};

				if (!newAstronomyData[day]) {
					newAstronomyData[day] = [];
				}
				newAstronomyData[day].push(entry);
			}
			prevMoonIdx = loopMoonIdx;

			const loopZodiacSign = getZodiacSign(loopDate);
			if (loopZodiacSign[0] !== prevZodiacSign[0]) {
				// We have a zodiac sign change on "day"
				const entry: AstronomyData = {
					name: loopZodiacSign[0],
					imgSrc: zodiacDir + loopZodiacSign[1]
				};

				if (!newAstronomyData[day]) {
					newAstronomyData[day] = [];
				}
				newAstronomyData[day].push(entry);
			}
			prevZodiacSign = loopZodiacSign;
		}

		astronomyData = newAstronomyData;
	};

	const generateCalendar = async () => {
		// const numDays = getDaysInMonth(currentMonth, currentYear);
		startDay = getStartDayOfMonth(currentMonth, currentYear);
		const newHolidayMap = await getObservationMap(currentYear, currentMonth);
		holidayMap = newHolidayMap;
	};

	updateAstronomy();

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
					inPast={todayDay <= day + 1}
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
