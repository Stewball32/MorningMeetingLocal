<script lang="ts">
	import LinedPaper from '$lib/linedpaper.svelte';
	import FinalDate from './FinalDate.svelte';
	import FindWeekday from './FindWeekday.svelte';

	export let id: string | null = 'date';
	export let animate = true;
	export let restart = true;
</script>

<section
	class=" flex h-full w-full flex-col"
	data-auto-animate-id={id}
	data-auto-animate={animate || null}
	data-auto-animate-restart={restart || null}
>
	<LinedPaper />

	<section
		data-auto-animate
		class="flex h-full flex-col items-stretch justify-evenly px-[6%] py-[4%]"
	>
		<FinalDate />

		<div class="flex h-[90%] w-full flex-col items-center justify-center">
			<span class="h1 text-balance text-9xl font-bold leading-relaxed"
				>Let's check the Calendar!</span
			>
		</div>
	</section>

	<FindWeekday />

</section>
