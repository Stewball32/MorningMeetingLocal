<script lang="ts">
	import type { StudentInteractComponentProps } from '$lib/slides';
	import type { SlideConfig } from './types';
	import ClassSlide from './+slide.svelte';

	let {
		classroom,
		deck,
		presentation,
		slide,
		students,
		teachers,
		guests,
		classroomActivity,
		studentActivity
	}: StudentInteractComponentProps = $props();
</script>

<!-- <ClassSlide
	{classroom}
	{deck}
	{presentation}
	{slide}
	{students}
	{teachers}
	{guests}
	{classroomActivity}
/> -->
