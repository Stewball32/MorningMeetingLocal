<script lang="ts">
	import type { SlideComponentPropsWrapper } from './_types';

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

	// Unpack slide config
	let {} = $derived(slide.config || {});
	let slideConfigCache = $state(slide.config);
	$effect(() => {
		if (slideConfigCache == slide.config) return;
		console.log('Slide config updated:', slide.config);
		slideConfigCache = slide.config;
	});

	// unpack slide data
	let {} = $derived(slide.data || {});
	let slideDataCache = $state(slide.data);
	$effect(() => {
		if (slideDataCache == slide.data) return;
		console.log('Slide data updated:', slide.data);
		slideDataCache = slide.data;
	});

	// Unpack classroom activity data
	let {} = $derived(classroomActivity.data || {});
	let classroomActivityDataCache = $state(classroomActivity.data);
	$effect(() => {
		if (classroomActivityDataCache == classroomActivity.data) return;
		console.log('Classroom activity data updated:', classroomActivity.data);
		classroomActivityDataCache = classroomActivity.data;
	});
</script>
