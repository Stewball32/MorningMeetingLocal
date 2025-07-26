<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import type { StudentViewComponentProps } from '.';
	// import NavArrows from '../class/NavArrows.svelte';
	import NavArrows from './NavArrows.svelte';

	interface StudentSlideWrapperProps extends StudentViewComponentProps {
		SlideComponent: Component<StudentViewComponentProps>;
		ControlComponent?: Component<StudentViewComponentProps>;
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
		studentActivity,
		presentation,
		SlideComponent,
		ControlComponent,
		moveSlide,
		styleRecord = $bindable<Record<string, string>>({
			transform: 'scale(1)',
			'transform-origin': 'center center'
		})
	}: StudentSlideWrapperProps = $props();

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
					{studentActivity}
					{presentation}
				/>
			</div>
			{#if moveSlide}
				<NavArrows pageLeft={() => moveSlide(-1)} pageRight={() => moveSlide(1)} />
			{/if}
		</div>
		{#if ControlComponent}
			<div id="controls" class="relative h-[1220px] w-[1920px] select-none overflow-visible">
				<ControlComponent
					{classroom}
					{deck}
					{guests}
					{students}
					{teachers}
					{slide}
					{classroomActivity}
					{studentActivity}
					{presentation}
				/>
			</div>
		{/if}
	</div>
</div>

<!-- <div
	id="slide-wrapper"
	class="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-green-500 align-middle"
>
	<div
		id="slide"
		class="relative aspect-[16/9] h-[1080px] w-[1920px] select-none overflow-visible bg-yellow-500"
		{style}
	>
		<img src="/paper.svg" draggable="false" class="absolute inset-0 h-full w-full" alt="" />
		<div
			class="inset-0 mb-[10px] ml-[143px] mr-[6px] mt-[4px] origin-top-left overflow-hidden rounded-br-[65px] rounded-tr-[65px]"
		>
			<SlideComponent
				{classroom}
				{deck}
				{guests}
				{students}
				{teachers}
				{slide}
				{classroomActivity}
				{studentActivity}
				{presentation}
			/>
		</div>
	</div>
	<div id="controls" class=" h-full w-full select-none overflow-visible bg-red-500" {style}></div>
</div> -->
