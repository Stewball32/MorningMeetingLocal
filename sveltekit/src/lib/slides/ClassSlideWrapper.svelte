<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import NavArrows from './NavArrows.svelte';
	import type { SlideComponentProps } from '.';

	interface SlideWrapperProps extends SlideComponentProps {
		SlideComponent: Component<SlideComponentProps>;
		moveSlide?: (offset: number) => void;
		styleRecord?: Record<string, string>;
	}

	let {
		classroom,
		deck,
		guests,
		students,
		teachers,
		slide,
		classroomActivity,
		personActivityMap,
		presentation,
		SlideComponent,
		moveSlide,
		styleRecord = $bindable<Record<string, string>>({
			transform: 'scale(1)',
			'transform-origin': 'center center'
		})
	}: SlideWrapperProps = $props();

	let style = $state('');
	$effect(() => {
		style = Object.entries(styleRecord)
			.map(([key, value]) => `${key}: ${value};`)
			.join(' ');
	});
	// let style = $derived(`transform: scale(${scale}); transform-origin: center center;`);
	// create style from style record
</script>

<div
	id="slide-wrapper"
	class="m-0 flex h-full w-full flex-col items-center justify-center overflow-hidden p-0 align-middle"
>
	<div
		id="slide-and-controls"
		class="relative m-0 w-[1920px] select-none overflow-visible p-0"
		{style}
	>
		<div id="slide" class="relative m-0 h-[1080px] w-[1920px] select-none overflow-visible p-0">
			<img src="/paper.svg" draggable="false" class="absolute inset-0 h-full w-full" alt="" />
			<div
				class="absolute inset-0 mb-[10px] ml-[143px] mr-[6px] mt-[4px] origin-top-left overflow-hidden rounded-br-[65px] rounded-tr-[65px]"
			>
				<SlideComponent
					{classroom}
					{deck}
					{guests}
					{students}
					{teachers}
					{slide}
					{classroomActivity}
					{personActivityMap}
					{presentation}
				/>
			</div>
			{#if moveSlide}
				<NavArrows pageLeft={() => moveSlide(-1)} pageRight={() => moveSlide(1)} />
			{/if}
		</div>
	</div>
</div>

<!-- <div
	id="slide-wrapper"
	class="flex h-full w-full items-center justify-center overflow-hidden align-middle"
>
	<div
		id="slide"
		class="relative aspect-[16/9] h-[1080px] w-[1920px] select-none overflow-visible"
		{style}
	>
		<img src="/paper.svg" draggable="false" class="absolute inset-0 h-full w-full" alt="" />
		<div
			class="absolute inset-0 mb-[10px] ml-[143px] mr-[6px] mt-[4px] origin-top-left overflow-hidden rounded-br-[65px] rounded-tr-[65px]"
		>
			<SlideComponent
				{classroom}
				{deck}
				{guests}
				{students}
				{teachers}
				{slide}
				{classroomActivity}
				{personActivityMap}
				{presentation}
			/>
		</div>
		{#if moveSlide}
			<NavArrows pageLeft={() => moveSlide(-1)} pageRight={() => moveSlide(1)} />
		{/if}
	</div>
</div> -->
