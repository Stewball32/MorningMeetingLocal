<script lang="ts">
	import { onMount } from 'svelte';
	import type { SlideComponentProps } from '$lib/slides';

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
	}: SlideComponentProps = $props();

	let slideData = $derived(classroomActivity.data);
	onMount(() => {});
</script>

<h1>Weather Slide</h1>
