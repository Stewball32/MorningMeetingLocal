<script lang="ts">
	import ClassSlide from './+slide.svelte';
	import type { StudentViewComponentPropsWrapper } from './_types';

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
	}: StudentViewComponentPropsWrapper = $props();
</script>

<ClassSlide
	{classroom}
	{deck}
	{presentation}
	{slide}
	{students}
	{teachers}
	{guests}
	{classroomActivity}
/>
