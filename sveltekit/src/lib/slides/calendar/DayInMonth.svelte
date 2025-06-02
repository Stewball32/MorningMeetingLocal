<script lang="ts">
	import type { Holiday } from '$lib/pb/calendar';
	import { onDestroy, onMount } from 'svelte';

	interface DayInMonthProps {
		day: number;
		month?: string;
		holidays: Holiday[];
		currentHoverDay?: number;
		inPast?: boolean;
		inCurrentMonth?: boolean;
		wasSelected?: boolean;
		isToday?: boolean;
		todayChosen?: boolean;
		isDisabled?: boolean;
		onHover?: (day: number) => void;
		onClick?: (day: number) => void;
		getDayClass?: (day: number) => string;
	}

	let {
		day,
		month = '',
		holidays = [],
		currentHoverDay = 0,
		inPast = false,
		inCurrentMonth = true,
		wasSelected = false,
		isToday = false,
		todayChosen = false,
		isDisabled = false,
		onHover = (day: number) => {},
		onClick = (day: number) => {},
		getDayClass = (day: number) => ''
	}: DayInMonthProps = $props();

	let baseBtnClass =
		'btn relative h-full p-0 cursor-pointer select-auto overflow-hidden rounded-none border ';
	let buttonTodayChosenClass = $derived(isToday && todayChosen ? 'z-2 outline-3 ' : '');
	let buttonClass = $derived(`${getDayClass(day)} ${buttonTodayChosenClass} ${baseBtnClass}`);

	let baseDayClass = 'text-size-1 pl-[2%] leading-none absolute right-[0%] top-0 rounded-bl-lg';
	let dayHoverClass = $derived(currentHoverDay == day ? 'font-bold' : '');
	let dayTodayChosenClass = $derived(
		isToday && todayChosen ? 'bg-black text-white font-black' : 'bg-white text-black font-normal '
	);
	let dayClass = $derived(`${baseDayClass} ${dayHoverClass} ${dayTodayChosenClass}`);

	let baseImageClass = 'm-0 h-full rounded-full p-0';
	let inPastClass = $derived(inPast ? 'opacity-75' : 'opacity-25');
	let imageClass = $derived(`${baseImageClass} ${inPastClass}`);

	let index = $state(0);
	let timer: ReturnType<typeof setInterval>;

	$effect(() => {
		if (holidays.length < 2) return clearInterval(timer);
		console.log('DayInMonth effect', day, holidays);
		console.log(holidays.some((h) => h.school === 'none') ? 'No School' : 'Short Day');
		timer = setInterval(() => {
			let oldIndex = index;
			index = (index + 1) % holidays.length;
			console.log(oldIndex, index);
		}, 3000);
	});

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<button
	onmouseenter={() => onHover(day)}
	onmouseleave={() => onHover(0)}
	onclick={() => onClick(day)}
	disabled={isDisabled}
	class={buttonClass}
>
	<span class={dayClass}>
		{day}
	</span>
	{#if holidays && holidays.length > 0}
		<img
			src={holidays[index]?.image}
			alt={holidays[index].name}
			class={imageClass}
			onerror={(e) => {
				(e.currentTarget as HTMLImageElement).src = '/defaults/calendar.png';
			}}
		/>
		<div class="absolute flex h-full w-[98%] flex-col items-center justify-center p-0">
			<span
				class="text-size-1 absolute line-clamp-2 w-full text-pretty text-center leading-none max-lg:pb-[1%]"
			>
				{holidays[index].name}
			</span>
		</div>
		{#if !holidays.every((h) => !h.school || h.school == 'full')}
			<span class="text-size-00 z-3 absolute bottom-0 truncate px-[2%] font-thin leading-none">
				({holidays.some((h) => h.school === 'none') ? 'No School!' : 'Short Day!'})
			</span>
		{/if}
	{/if}
</button>
