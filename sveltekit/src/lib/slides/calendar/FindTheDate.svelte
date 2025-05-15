<script lang="ts">
	import type { ClassDaily } from '$lib/pb/types';

	interface FindTheDateProps {
		classDaily: ClassDaily;
		currentCheck?: 'weekday' | 'day' | 'month' | 'year';
		startWithSunday?: boolean;
		pageLeft: () => void;
		pageRight: () => void;
		updateClassDailySlide: (
			column: string,
			partialClassDaily: Partial<ClassDaily>
		) => Promise<void>;
	}

	type Weekday = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
	type Month =
		| 'January'
		| 'February'
		| 'March'
		| 'April'
		| 'May'
		| 'June'
		| 'July'
		| 'August'
		| 'September'
		| 'October'
		| 'November'
		| 'December';

	let {
		classDaily,
		currentCheck = $bindable(),
		startWithSunday = $bindable(false),
		pageLeft = () => {},
		pageRight = () => {},
		updateClassDailySlide = async (column: string, partialClassDaily: Partial<ClassDaily>) => {}
	}: FindTheDateProps = $props();

	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	const todayWeekday = today.toLocaleString('en-US', { weekday: 'long' }) as Weekday;
	const yesterdayWeekday: Weekday = yesterday.toLocaleString('en-US', {
		weekday: 'long'
	}) as Weekday;
	// numeric day of the month typed as number
	// const todayDay = today.getDate();
	// const yesterdayDay = yesterday.getDate();
	// const todayMonth = today.toLocaleString('en-US', { month: 'long' });
	// const yesterdayMonth = yesterday.toLocaleString('en-US', { month: 'long' });
	// const todayYear = today.getFullYear();
	// const yesterdayYear = yesterday.getFullYear();

	const todayDay = 31;
	const yesterdayDay = 30;
	const todayMonth = 'September';
	const yesterdayMonth = 'September';
	const todayYear = 2025;
	const yesterdayYear = 2025;

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

	let selectedWeekday: Weekday | undefined = $state();
	let selectedMonth: Month | undefined = $state();
	let selectedDay: number | undefined = $state();
	let selectedYear: number | undefined = $state();

	let weekdayOptions: Weekday[] = startWithSunday
		? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	const daysInMonth = new Date(todayYear, today.getMonth() + 1, 0).getDate();
	const yearOptions: number[] = $derived(
		today.getMonth() < 7 // before August
			? [todayYear - 1, todayYear, todayYear + 1]
			: [todayYear, todayYear + 1, todayYear - 1]
	);

	let weekdayBackgrounds = {
		Sunday: 'bg-red-300',
		Monday: 'bg-orange-300',
		Tuesday: 'bg-yellow-300',
		Wednesday: 'bg-green-300',
		Thursday: 'bg-blue-300',
		Friday: 'bg-indigo-300',
		Saturday: 'bg-violet-300'
	};

	const setCheck = (check: 'weekday' | 'day' | 'month' | 'year') => {
		currentCheck = currentCheck == check ? undefined : check;
		updateClassDailySlide('calendar', { currentCheck });
	};
</script>

<div class="flex h-full w-full cursor-default select-none flex-col items-center justify-center">
	<h1 class="text-size-7 h-[15%] font-bold">Let's find today's date!</h1>
	<div class="flex h-[18%] w-full items-center justify-center bg-green-500 font-bold">
		<div class="flex h-full flex-col items-center justify-center bg-gray-500">
			<span class="text-size-3 flex h-1/2 w-full items-end justify-end text-nowrap bg-blue-500"
				>If yesterday was</span
			>
			<span class=" text-size-3 flex h-1/2 w-full items-end justify-end text-nowrap bg-red-500"
				>...then today is</span
			>
		</div>
		<div class="flex h-full flex-col items-start justify-around">
			<div class="flex">
				<span
					class={weekdayBackgrounds[yesterdayWeekday] +
						' btn text-size-4 rounded-4xl ml-[1%] cursor-default select-none border px-[1%] py-[.25%] font-bold'}
				>
					<span class="z-0 text-transparent">
						{longestWeekday}
					</span>
					<span class="absolute">
						{yesterdayWeekday},
					</span>
				</span>
				<span class="text-size-4 font-bold"></span>
				<span class={'btn text-size-4 rounded-4xl cursor-default select-none px-[1%] font-bold'}>
					{yesterdayMonth}
				</span>
				<span class="btn text-size-4 rounded-4xl cursor-default select-none px-[1%] font-bold">
					{yesterdayDay},
				</span>
				<span class="btn text-size-4 rounded-4xl cursor-default select-none px-[1%] font-bold">
					{yesterdayYear}...
				</span>
				<span class="text-size-3 font-bold"></span>
			</div>
			<div class="flex">
				<button
					onclick={() => setCheck('weekday')}
					class="btn preset-outlined-surface-500 text-size-4 relative ml-[1%] rounded-full bg-gray-100 px-[1%] py-0 font-bold outline-2"
				>
					<span class="z-0 text-transparent">
						{longestWeekday}
					</span>
					{#if selectedWeekday == todayWeekday}
						<span
							class="text-size-4 absolute z-10 flex h-full w-full items-center justify-center rounded-full font-bold"
						>
							{todayWeekday},
						</span>
					{:else}
						<span
							class="text-size-4 absolute z-10 flex h-full w-full items-center justify-center rounded-full font-light italic"
						>
							Weekday,
						</span>
					{/if}
				</button>
				<button
					class="btn preset-outlined-surface-500 text-size-4 relative ml-[1%] rounded-full bg-gray-100 px-[1%] py-0 font-bold outline-2"
				>
					<span class="z-0 text-transparent">
						{todayMonth.length > 'Month'.length ? todayMonth : 'Month'}
					</span>
					{#if selectedMonth == todayMonth}
						<span
							class="text-size-4 absolute z-10 flex h-full w-full items-center justify-center rounded-full font-bold"
						>
							{todayMonth}
						</span>
					{:else}
						<span
							class="text-size-4 absolute z-10 flex h-full w-full items-center justify-center rounded-full font-light italic"
						>
							Month
						</span>
					{/if}
				</button>
				<button
					onclick={() => setCheck('day')}
					class="btn preset-outlined-surface-500 text-size-4 relative ml-[1%] rounded-full bg-gray-100 px-[1%] font-bold outline-2"
				>
					<span class="z-0 text-transparent">
						{'Day'}
					</span>
					{#if selectedDay == todayDay}
						<span
							class="text-size-4 absolute z-10 flex h-full w-full items-center justify-center rounded-full font-bold"
						>
							{todayDay}
						</span>
					{:else}
						<span
							class="text-size-4 absolute z-10 flex h-full w-full items-center justify-center rounded-full font-light italic"
						>
							Day
						</span>
					{/if}
				</button>
				<span class="text-size-4 font-bold">,</span>
				<button
					onclick={() => setCheck('year')}
					class={(currentCheck == 'year' ? 'outline-3 bg-gray-200' : 'bg-gray-100 outline-2') +
						' btn preset-outlined-surface-500 text-size-4 relative ml-[1%] select-none rounded-full  px-[1%]'}
				>
					<span class="z-0 text-transparent">Year</span>
					{#if selectedYear == todayYear}
						<span
							class="text-size-4 absolute z-10 flex h-full w-full items-center justify-center rounded-full font-bold"
						>
							{todayYear}
						</span>
					{:else}
						<span
							class={(currentCheck == 'year' ? 'font-bold' : 'font-light') +
								' text-size-4 absolute z-10 flex h-full w-full items-center justify-center rounded-full  italic'}
						>
							Year
						</span>
					{/if}
				</button>
				<span class="text-size-4 font-bold">!</span>
			</div>
		</div>
	</div>
	<div class="h-[70%] w-[99%] select-none">
		{#if currentCheck === 'weekday'}
			<div class="flex h-full w-full flex-col items-center justify-center gap-[1%]">
				{#each weekdayOptions as weekday}
					<button
						class={'btn preset-outlined-surface-500 text-size-4 rounded-full font-bold outline-2 ' +
							weekdayBackgrounds[weekday]}
					>
						{weekday}
					</button>
				{/each}
			</div>
		{:else if currentCheck == 'month'}
			<div class="grid h-full w-full grid-cols-2">
				<div class="flex h-full w-full flex-col items-center justify-center gap-[2%]">
					{#each ['January', 'February', 'March', 'April', 'May', 'June'] as month}
						<button
							class="btn preset-outlined-surface-500 text-size-5 gap-[1%] rounded-full px-[1%] py-0 font-bold outline-2"
						>
							<img src="/months/default.png" alt={month} class="m-0 h-[2rem] p-0 xl:h-[3rem]" />
							{month}
						</button>
					{/each}
				</div>
				<div class="flex h-full w-full flex-col items-center justify-center gap-[2%]">
					{#each ['July', 'August', 'September', 'October', 'November', 'December'] as month}
						<button
							class="btn preset-outlined-surface-500 gap-[1%] rounded-full px-[1%] py-0 font-bold outline-2"
						>
							<img src="/months/default.png" alt={month} class="m-0 h-[2rem] p-0 xl:h-[3rem]" />
							<span class="text-size-5 hover:scale-110">
								{month}
							</span>
						</button>
					{/each}
				</div>
			</div>
		{:else if currentCheck == 'day'}
			<div class="grid h-full w-full grid-cols-10">
				{#each Array(daysInMonth).keys() as day}
					<button
						class="btn preset-tonal-surface text-size-6 m-[5%] rounded-3xl font-bold outline-2 hover:scale-110"
					>
						<span class="text-size-5">
							{day + 1}
						</span>
					</button>
				{/each}
			</div>
		{:else if currentCheck == 'year'}
			<div class="flex h-full w-full flex-row items-center justify-evenly">
				{#each yearOptions as year}
					<button
						class="btn preset-outlined-surface-500 text-size-7 rounded-full font-bold outline-2"
					>
						{year}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
