<script lang="ts">
	import type { StudentInteractComponentPropsWrapper } from './_types';

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
	}: StudentInteractComponentPropsWrapper = $props();

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

	// unpack student activity data
	let {} = $derived(studentActivity?.data || {});
	let studentActivityDataCache = $state(studentActivity?.data);
	$effect(() => {
		if (studentActivityDataCache == studentActivity?.data) return;
		console.log('Student activity data updated:', studentActivity?.data);
		studentActivityDataCache = studentActivity?.data;
	});
</script>
