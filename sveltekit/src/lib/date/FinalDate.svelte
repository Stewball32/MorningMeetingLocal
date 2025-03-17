<script lang="ts">

	type PropData = {
		weekday?: string;
		month?: string;
		day?: string;
		year?: string;
	};

	let { 
		weekday = "Weekday",
		month = "Month",
		day = "Day",
		year = "Year"
	}: PropData = $props();

</script>

<div data-id="today-container" class="flex w-full flex-col items-center justify-center ">
	<span data-id="today-is" class="h1 text-balance text-4xl font-bold">Today's date is...</span>
	<div data-id="today-sentence" class="flex flex-row flex-wrap items-center justify-center">
		<span
			data-id="today-weekday"
			class="h1 preset-outlined-surface-500 mx-1 text-balance rounded-full p-2 text-5xl font-bold"
			>{weekday}</span
		>
		<span
			data-id="today-month"
			class="h1 preset-outlined-surface-500 mx-1 text-balance rounded-full p-2 text-5xl font-bold"
			>{month}</span
		>
		<span
			data-id="today-day"
			class="h1 preset-outlined-surface-500 mx-1 text-balance rounded-full p-2 text-5xl font-bold"
			>{day}</span
		>
		<span data-id="today-comma" class="h1 text-balance text-4xl font-bold leading-relaxed"
			>,</span
		>
		<span
			data-id="today-year"
			class="h1 preset-outlined-surface-500 mx-1 text-balance rounded-full p-2 text-5xl font-bold"
			>{year}</span
		>
	</div>
</div>