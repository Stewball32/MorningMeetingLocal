<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import Holidays from 'date-holidays';

	const hd = new Holidays('US', 'CA');

	const holidayMap = new Map<number, Array<string[]>>();
	const holidayYears: number[] = [];

	for (let year = 2020; year <= 2030; year++) {
		const holidays = hd.getHolidays(year).filter((holiday) => {
			return !holiday.substitute;
		});

		let holidaysInYear: Array<string[]> = [];

		holidays.forEach((holiday) => {
			const date = new Date(holiday.dateObj);
			// add a leading zero to month and day if needed
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			const stringArray = [`${month}/${day}`, holiday.name, holiday.type];
			holidaysInYear.push(stringArray);
		});
		holidayMap.set(year, holidaysInYear);
		holidayYears.push(year);
	}
</script>

<div class="grid grid-cols-3 items-start justify-center">
	{#each holidayYears as year}
		<div class="mb-4 w-full border-b-2 border-gray-300">
			<div class="mb-2 text-center text-gray-500">
				<h2 class="text-lg font-semibold">{year}</h2>
			</div>
			{#each holidayMap.get(year) ?? [] as holiday}
				<div class="flex justify-between px-4 py-2">
					<span class="text-bold">{holiday[0]}</span>
					<span class="text-gray-700">{holiday[1]}</span>
					<span class="text-sm italic">{holiday[2]}</span>
				</div>
			{/each}
		</div>
	{/each}
</div>
