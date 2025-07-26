<script lang="ts">
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
</script>
