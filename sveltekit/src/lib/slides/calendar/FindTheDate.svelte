<script lang="ts">
	import type { ClassDaily } from '$lib/pb/types';
	import type { Check, Month, Weekday } from './_types';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import { updateSound } from '$lib/sounds';
	import ResetSlide from '$lib/slides/ResetSlide.svelte';

	interface FindTheDateProps {
		classDaily: ClassDaily;
		today: Date;
		todayWeekday: Weekday;
		yesterdayWeekday: Weekday;
		todayMonth: Month;
		yesterdayMonth: Month;
		todayDay: number;
		yesterdayDay: number;
		todayYear: number;
		yesterdayYear: number;
		currentCheck?: Check;
		weekdayGuesses?: Weekday[];
		monthGuesses?: Month[];
		dayGuesses?: number[];
		yearGuesses?: number[];
		startWithSunday?: boolean;
		weekdayBackgrounds: Record<Weekday, string>;
		weekdayTextColors: Record<Weekday, string>;
		pageLeft: () => void;
		pageRight: () => void;
		updateClassDailySlide: (
			column: string,
			partialClassDaily: Partial<ClassDaily>
		) => Promise<void>;
	}

	let {
		classDaily,
		currentCheck,
		today = new Date(),
		todayWeekday,
		yesterdayWeekday,
		todayMonth,
		yesterdayMonth,
		todayDay,
		yesterdayDay,
		todayYear,
		yesterdayYear,
		weekdayGuesses = [],
		monthGuesses = [],
		dayGuesses = [],
		yearGuesses = [],
		startWithSunday = $bindable(false),
		weekdayBackgrounds,
		weekdayTextColors,
		pageLeft = () => {},
		pageRight = () => {},
		updateClassDailySlide = async (column: string, partialClassDaily: Partial<ClassDaily>) => {}
	}: FindTheDateProps = $props();

	const weekdayPlaceholder = 'Weekday';
	const longestWeekday = $derived(
		weekdayPlaceholder.length > todayWeekday.length &&
			weekdayPlaceholder.length > yesterdayWeekday.length
			? weekdayPlaceholder
			: todayWeekday.length > yesterdayWeekday.length
				? todayWeekday
				: yesterdayWeekday
	);

	const monthPlaceholder = 'Month';
	const longestMonth = $derived(
		monthPlaceholder.length > todayMonth.length && monthPlaceholder.length > yesterdayMonth.length
			? monthPlaceholder
			: todayMonth.length > yesterdayMonth.length
				? todayMonth
				: yesterdayMonth
	);

	let selectedWeekday: Weekday | undefined = $derived(weekdayGuesses[0]);
	const updateWeekday = async (value: Weekday) => {
		if (selectedWeekday == todayWeekday) return;
		let updatedWeekdayGuesses = classDaily?.calendar?.weekdayGuesses ?? [];
		updatedWeekdayGuesses.unshift(value);
		weekdayGuesses = updatedWeekdayGuesses;
		let partial = {
			...classDaily.calendar,
			weekdayGuesses: updatedWeekdayGuesses
		};
		let sound = selectedWeekday == todayWeekday ? 'correct' : 'incorrect';
		updateSound('find-weekday', sound);

		await updateClassDailySlide('calendar', partial);
	};

	let selectedMonth: Month | undefined = $derived(monthGuesses[0]);
	const updateMonth = async (value: Month) => {
		if (selectedMonth == todayMonth) return;
		let updatedMonthGuesses = classDaily?.calendar?.monthGuesses ?? [];
		updatedMonthGuesses.unshift(value);
		monthGuesses = updatedMonthGuesses;
		let partial = {
			...classDaily.calendar,
			monthGuesses: updatedMonthGuesses
		};
		let sound = selectedMonth == todayMonth ? 'correct' : 'incorrect';
		updateSound('find-month', sound);

		await updateClassDailySlide('calendar', partial);
	};

	let selectedDay: number | undefined = $derived(dayGuesses[0]);
	const updateDay = async (value: number) => {
		if (selectedDay == todayDay) return;
		let updatedDayGuesses = classDaily?.calendar?.dayGuesses ?? [];
		updatedDayGuesses.unshift(value);
		dayGuesses = updatedDayGuesses;
		let partial = {
			...classDaily.calendar,
			dayGuesses: updatedDayGuesses
		};
		let sound = selectedDay == todayDay ? 'correct' : 'incorrect';
		updateSound('find-day', sound);
		await updateClassDailySlide('calendar', partial);
	};

	let selectedYear: number | undefined = $derived(yearGuesses[0]);
	const updateYear = async (value: number) => {
		if (selectedYear == todayYear) return;
		let updatedYearGuesses = classDaily?.calendar?.yearGuesses ?? [];
		updatedYearGuesses.unshift(value);
		yearGuesses = updatedYearGuesses;
		let partial = {
			...classDaily.calendar,
			yearGuesses: updatedYearGuesses
		};
		let sound = selectedYear == todayYear ? 'correct' : 'incorrect';
		updateSound('find-year', sound);

		await updateClassDailySlide('calendar', partial);
	};

	const resetGuesses = async () => {
		weekdayGuesses = [];
		monthGuesses = [];
		dayGuesses = [];
		yearGuesses = [];
		let partial = {
			...classDaily.calendar,
			weekdayGuesses: [],
			monthGuesses: [],
			dayGuesses: [],
			yearGuesses: []
		};
		await updateClassDailySlide('calendar', partial);
	};

	let weekdayOptions: Weekday[] = startWithSunday
		? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	const daysInMonth = new Date(todayYear, today.getMonth() + 1, 0).getDate();
	const yearOptions: number[] = $derived(
		today.getMonth() < 7 // before August
			? [todayYear - 1, todayYear, todayYear + 1]
			: [todayYear, todayYear + 1, todayYear - 1]
	);

	const setCheck = (check: Check) => {
		currentCheck = currentCheck == check ? undefined : check;
		updateClassDailySlide('calendar', { currentCheck });
	};

	const baseBtnClass =
		'btn preset-outlined-surface-500 text-size-4 select-none relative mx-[1%] rounded-full px-[1.5%] py-0';

	function onKeydown(event: KeyboardEvent) {
		let correctAnswers = [
			selectedWeekday == todayWeekday,
			selectedMonth == todayMonth,
			selectedDay == todayDay,
			selectedYear == todayYear
		];
		let checkOrder: Check[] = ['weekday', 'month', 'day', 'year'];
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			if (!currentCheck) return (currentCheck = 'weekday');
			if (correctAnswers.every((answer) => answer)) return pageRight();
			for (var i = 0; i < correctAnswers.length; i++) {
				if (correctAnswers[i]) continue;
				if (currentCheck != checkOrder[i]) {
					currentCheck = checkOrder[i];
					updateClassDailySlide('calendar', { currentCheck });
					break;
				} else {
					switch (currentCheck) {
						case 'weekday':
							updateWeekday(todayWeekday);
							break;
						case 'month':
							updateMonth(todayMonth);
							break;
						case 'day':
							updateDay(todayDay);
							break;
						case 'year':
							updateYear(todayYear);
							break;
						default:
							pageRight();
							break;
					}
					break;
				}
			}
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			pageLeft();
		}
	}
</script>

<svelte:window on:keydown={onKeydown} />

<ResetSlide onclick={resetGuesses} />

<div class="flex h-full w-full cursor-default select-none flex-col items-center justify-center">
	<h1 class="text-size-7 h-[15%] font-bold">Let's find today's date!</h1>
	<div class="flex h-[18%] w-full items-center justify-center">
		<div class="text-size-3 flex-1/3 flex h-full flex-col items-center justify-center">
			<span class="flex h-1/2 w-full items-end justify-end text-nowrap">If yesterday was</span>
			<span class="flex h-1/2 w-full items-end justify-end text-nowrap">...then today is</span>
		</div>
		<div class="flex-2/3 flex h-full flex-col items-start justify-around">
			<!--Yesterday was...-->
			<div class="flex items-end justify-start">
				<span
					class={`${weekdayBackgrounds[yesterdayWeekday]}
						btn text-size-4 rounded-4xl mx-[1%] cursor-default select-none px-[1.5%] py-[.25%] font-bold outline`}
				>
					<span class="z-0 text-transparent">
						{longestWeekday}
					</span>
					<span class="absolute">
						{yesterdayWeekday},
					</span>
				</span>
				<span
					class={'btn text-size-4 rounded-4xl mx-[1%] cursor-default select-none border border-transparent px-[1.5%] py-[.25%] font-bold'}
				>
					<span class="z-0 text-transparent">
						{longestMonth}
					</span>
					<span class="absolute">
						{yesterdayMonth}
					</span>
				</span>
				<span
					class={'btn text-size-4 rounded-4xl mx-[1%] cursor-default select-none border border-transparent px-[1.5%] py-[.25%] font-bold'}
				>
					<span class="z-0 text-transparent"> Day, </span>
					<span class="absolute">
						{yesterdayDay},
					</span>
				</span>
				<span
					class={'btn text-size-4 rounded-4xl ml-[1%] mr-0  cursor-default select-none border border-transparent py-[.25%] pl-[1.5%] pr-0 font-bold'}
				>
					{yesterdayYear}
				</span>
				<span class="text-size-3 py-[.25%] font-bold">...</span>
			</div>
			<!--Today is...-->
			<div class="flex items-end justify-start">
				<button
					onclick={() => setCheck('weekday')}
					class={`${currentCheck == 'weekday' ? 'outline-4' : 'outline-2'}
            ${selectedWeekday == todayWeekday ? weekdayBackgrounds[todayWeekday] : 'bg-gray-100 hover:scale-110 active:scale-95'} ${baseBtnClass}`}
				>
					<span class="z-0 text-transparent">
						{longestWeekday}
					</span>
					<div class="z-2 absolute flex h-full w-full items-center justify-center rounded-full">
						{#if selectedWeekday == todayWeekday}
							<span class={`${currentCheck == 'weekday' ? 'font-extrabold' : 'font-bold'}`}>
								{todayWeekday},
							</span>
						{:else}
							<span
								class={`${currentCheck == 'weekday' ? 'font-bold' : 'font-light'} italic text-gray-400`}
							>
								Weekday,
							</span>
						{/if}
					</div>
				</button>
				<button
					onclick={() => setCheck('month')}
					class={`${currentCheck == 'month' ? 'outline-4' : 'outline-2'}
            ${selectedMonth == todayMonth ? '' : 'bg-gray-100 hover:scale-110 active:scale-95'} ${baseBtnClass}`}
				>
					<span class="z-0 text-transparent">
						{longestMonth}
					</span>
					<div class="z-2 absolute flex h-full w-full items-center justify-center rounded-full">
						{#if selectedMonth == todayMonth}
							<span class={`${currentCheck == 'month' ? 'font-extrabold' : 'font-bold'}`}>
								{todayMonth}
							</span>
						{:else}
							<span
								class={`${currentCheck == 'month' ? 'font-bold' : 'font-light'} italic text-gray-400`}
							>
								Month
							</span>
						{/if}
					</div>
				</button>
				<button
					onclick={() => setCheck('day')}
					class={`${currentCheck == 'day' ? 'outline-4' : 'outline-2'}
            ${selectedDay == todayDay ? '' : 'bg-gray-100 hover:scale-110 active:scale-95'} ${baseBtnClass}`}
				>
					<span class="z-0 text-transparent"> Day, </span>
					<div class="z-2 absolute flex h-full w-full items-center justify-center rounded-full">
						{#if selectedDay == todayDay}
							<span class={`${currentCheck == 'day' ? 'font-extrabold' : 'font-bold'}`}>
								{todayDay}
							</span>
						{:else}
							<span
								class={`${currentCheck == 'day' ? 'font-bold' : 'font-light'} italic text-gray-400`}
							>
								Day,
							</span>
						{/if}
					</div>
				</button>
				<button
					onclick={() => setCheck('year')}
					class={`${currentCheck == 'year' ? 'outline-4' : 'outline-2'}
            ${selectedYear == todayYear ? '' : 'bg-gray-100 hover:scale-110 active:scale-95'} ${baseBtnClass}`}
				>
					<span class="z-0 text-transparent"> {todayYear} </span>
					<div class="z-2 absolute flex h-full w-full items-center justify-center rounded-full">
						{#if selectedYear == todayYear}
							<span class={`${currentCheck == 'year' ? 'font-extrabold' : 'font-bold'}`}>
								{todayYear}
							</span>
						{:else}
							<span
								class={`${currentCheck == 'year' ? 'font-bold' : 'font-light'} italic text-gray-400`}
							>
								Year
							</span>
						{/if}
					</div>
				</button>
				<span class="text-size-4 font-bold">!</span>
			</div>
		</div>
	</div>
	<div class="h-[70%] w-[99%] select-none">
		{#if currentCheck === 'weekday'}
			<!--Weekday Buttons-->
			<div class="flex h-full w-full flex-col items-center justify-center gap-[1%]">
				{#each weekdayOptions as weekday}
					<button
						onclick={() => updateWeekday(weekday)}
						disabled={selectedWeekday == todayWeekday ? false : weekdayGuesses.includes(weekday)}
						class={`${weekday == selectedWeekday && selectedWeekday == todayWeekday ? weekdayTextColors[weekday] + ' bg-black font-black outline-8' : weekdayBackgrounds[weekday] + ' font-bold outline-2'}
              ${selectedWeekday == todayWeekday ? '' : 'hover:scale-110 active:scale-95'}
              btn preset-outlined-surface-500 text-size-4 select-none rounded-full`}
					>
						<span class="select-none">
							{weekday}
						</span>
					</button>
				{/each}
			</div>
		{:else if currentCheck == 'month'}
			<!--Month Buttons-->
			<div class="grid h-full w-full grid-cols-3">
				<div class="flex h-full w-full select-none flex-col items-center justify-evenly gap-[2%]">
					{#each ['January', 'February', 'March', 'April'] as Month[] as month}
						<button
							onclick={() => updateMonth(month)}
							disabled={selectedMonth == todayMonth ? false : monthGuesses.includes(month)}
							class={` ${month == selectedMonth && selectedMonth == todayMonth ? 'bg-black font-black text-white outline-8' : 'font-bold outline-2'}
                ${selectedMonth == todayMonth ? '' : 'hover:scale-110 active:scale-95'}
                btn preset-outlined-surface-500 text-size-5 select-none gap-[1%] rounded-full p-[2%] `}
						>
							<img src="/months/default.png" alt={month} class="m-0 h-[2rem] p-0 xl:h-[3rem]" />
							<span class="select-none">
								{month}
							</span>
						</button>
					{/each}
				</div>
				<div class="flex h-full w-full select-none flex-col items-center justify-evenly gap-[2%]">
					{#each ['May', 'June', 'July', 'August'] as Month[] as month}
						<button
							onclick={() => updateMonth(month)}
							disabled={selectedMonth == todayMonth ? false : monthGuesses.includes(month)}
							class={` ${month == selectedMonth && selectedMonth == todayMonth ? 'bg-black font-black text-white outline-8' : 'font-bold outline-2'}
                ${selectedMonth == todayMonth ? '' : 'hover:scale-110 active:scale-95'}
                btn preset-outlined-surface-500 text-size-5 select-none gap-[1%] rounded-full p-[2%] `}
						>
							<img src="/months/default.png" alt={month} class="m-0 h-[2rem] p-0 xl:h-[3rem]" />
							<span class="select-none">
								{month}
							</span>
						</button>
					{/each}
				</div>
				<div class="flex h-full w-full select-none flex-col items-center justify-evenly gap-[2%]">
					{#each ['September', 'October', 'November', 'December'] as Month[] as month}
						<button
							onclick={() => updateMonth(month)}
							disabled={selectedMonth == todayMonth ? false : monthGuesses.includes(month)}
							class={` ${month == selectedMonth && selectedMonth == todayMonth ? 'bg-black font-black text-white outline-8' : 'font-bold outline-2'}
                ${selectedMonth == todayMonth ? '' : 'hover:scale-110 active:scale-95'}
                btn preset-outlined-surface-500 text-size-5 select-none gap-[1%] rounded-full p-[2%] `}
						>
							<img src="/months/default.png" alt={month} class="m-0 h-[2rem] p-0 xl:h-[3rem]" />
							<span class="select-none">
								{month}
							</span>
						</button>
					{/each}
				</div>
			</div>
		{:else if currentCheck == 'day'}
			<!--Day Buttons-->
			<div class="grid h-full w-full grid-cols-10">
				{#each Array(daysInMonth).keys() as day}
					<button
						onclick={() => updateDay(day + 1)}
						disabled={selectedDay == todayDay ? false : dayGuesses.includes(day + 1)}
						class={` ${day + 1 == selectedDay && selectedDay == todayDay ? 'bg-black font-black text-white outline-8' : 'font-bold outline-2'}
              ${selectedDay == todayDay ? '' : 'hover:scale-110 active:scale-95'}
              btn preset-tonal-surface m-[5%] select-none rounded-3xl`}
					>
						<span class="text-size-5 select-none">
							{day + 1}
						</span>
					</button>
				{/each}
			</div>
		{:else if currentCheck == 'year'}
			<!--Year Buttons-->
			<div class="flex h-full w-full flex-row items-center justify-evenly">
				{#each yearOptions as year}
					<button
						onclick={() => updateYear(year)}
						disabled={selectedYear == todayYear ? false : yearGuesses.includes(year)}
						class={` ${year == selectedYear && selectedYear == todayYear ? 'bg-black font-black text-white outline-8' : 'font-bold outline-2'}
              ${selectedYear == todayYear ? '' : 'hover:scale-110 active:scale-95'}
              btn preset-outlined-surface-500 text-size-7 select-none rounded-full`}
					>
						<span class="text-size-7 select-none">
							{year}
						</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
