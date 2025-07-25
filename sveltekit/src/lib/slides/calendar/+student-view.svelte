<script lang="ts">
	import type { StudentViewProps } from '$lib/slides';
	import type { SlideConfig } from './types';
	import ClassSlide from './+slide.svelte';

	import { onMount } from 'svelte';

	let {
		// classroom,
		// deck,
		// presentation,
		slide
		// students,
		// teachers,
		// guests,
		// classroomActivity,
		// studentActivity
	}: StudentViewProps = $props();

	let {}: SlideConfig = $derived(slide.config) as SlideConfig;
	onMount(() => {});
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
