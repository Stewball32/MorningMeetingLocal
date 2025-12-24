<script lang="ts">
	import type { SlideComponentPropsWrapper } from './_types';
	import Banner from '$lib/slideAssets/decorations/Banner.svelte';
	import Underline from '$lib/slideAssets/decorations/Underline.svelte';
	import Star from '$lib/slideAssets/decorations/Star.svelte';
	import RainCloud from '$lib/slideAssets/decorations/RainCloud.svelte';
	import RainDrop from '$lib/slideAssets/decorations/RainDrop.svelte';

	let {
		classroom,
		deck,
		presentation,
		slide,
		students,
		teachers,
		guests,
		classroomActivity,
		personActivityMap
	}: SlideComponentPropsWrapper = $props();

	let { title = 'Slide Title', subtitle = '', paragraph = '' } = $derived(slide.config);
</script>

<div
	class="absolute inset-0 left-0 top-[250px] z-20 flex h-[800px] w-[1200px] flex-col items-center justify-center text-center"
>
	<h2 class="text-ellipsis">{title}</h2>
	<h5 class="pt-[10px]">{subtitle}</h5>
	<Underline />
	{#if !paragraph}
		<div class="h-[100px] w-full"></div>
	{/if}
	<p class="pt-[10px]">
		{paragraph}
	</p>
</div>

<Banner
	width={1200}
	height={250}
	numberOfShapes={6}
	shapes="burgees"
	class="z-5 absolute left-0 top-[25px] "
/>
<Star class="z-2 absolute left-[1150px] top-[350px] w-[100px]" />
<RainCloud class="z-2 absolute right-[20px] top-[50px] w-[500px]" />
<RainDrop class="z-2 absolute right-[50px] top-[520px] w-[125px]" color="pink" />
<RainDrop class="z-2 absolute right-[375px] top-[600px] w-[175px]" color="yellow" />
<RainDrop class="z-2 absolute right-[120px] top-[750px] w-[200px]" color="green" />
