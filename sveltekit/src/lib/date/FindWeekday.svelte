<script lang="ts">
	import FinalDate from './FinalDate.svelte';

	const weekdayCss = "preset-outlined-surface-500 rounded-full p-2 text-xl";
</script>


<section
	data-auto-animate
	class="flex h-full flex-col items-stretch justify-evenly px-[6%] py-[4%]"
>
	<FinalDate />

	<span class="h1 text-balance text-6xl font-bold py-10 ">
		The Weekday for today is...
	</span>

	<div class="grid w-full grid-flow-col grid-cols-7 items-center justify-evenly pl-4 py-10">
		<span class={weekdayCss} data-id="Sunday">Sunday</span>
		<span class={weekdayCss} data-id="Monday">Monday</span>
		<span class={weekdayCss} data-id="Tuesday">Tuesday</span>
		<span class={weekdayCss} data-id="Wednesday">Wednesday</span>
		<span class={weekdayCss} data-id="Thursday">Thursday</span>
		<span class={weekdayCss} data-id="Friday">Friday</span>
		<span class={weekdayCss} data-id="Saturday">Saturday</span>
	</div>

	<div data-id="weekday" class="grid w-full grid-cols-3 items-center justify-center p-4">
		<div data-id="weekday-yesterday" class="flex flex-col items-center justify-evenly">
			<span class="text-4xl">Yesterday</span>
			<span class="text-2xl">was...</span>
		</div>
		<div data-id="weekday-today" class="flex flex-col items-center justify-evenly">
			<span class="text-4xl">Today</span>
			<span class="text-2xl">is...</span>
		</div>
		<div data-id="weekday-tomorrow" class="flex flex-col items-center justify-evenly">
			<span class="text-4xl">Tomorrow</span>
			<span class="text-2xl">will be...</span>
		</div>
		<span class="w-full p-10 text-5xl" data-id="weekday-yesterday">Tuesday</span>
		<span class="w-full p-10 text-5xl" data-id="weekday-today">Wednesday</span>
		<span class="w-full p-10 text-5xl" data-id="weekday-tomorrow">Thursday</span>
	</div>
</section>
