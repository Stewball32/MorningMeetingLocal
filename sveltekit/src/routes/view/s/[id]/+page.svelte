<script lang="ts">
	import { onDestroy, onMount, type Component } from 'svelte';
	import type { PageData } from './$types';
	import type {
		StudentInteractComponentProps,
		SlideComponentProps,
		StudentViewComponentProps
	} from '$lib/slides';
	import type { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
	import { subscribeToActivityRecord } from '$lib/pb/records';
	import type {
		ActivityClassroomPB,
		ActivityGuestPB,
		ActivityStudentPB,
		ActivityTeacherPB
	} from '$lib/pb/types';
	import StudentSlideWrapper from '$lib/slides/StudentSlideWrapper.svelte';

	let { data }: { data: PageData } = $props();

	const {
		classroom,
		deck,
		guests,
		students,
		teachers,
		studentInteractComponents,
		studentViewComponents,
		slides
	} = data;

	let classroomActivityArray = $state(data.classroomActivityArray || []);
	let studentActivityArray = $state(data.studentActivityArray || []);
	let presentation = $state(data.presentation || {});
	let SlideComponent: Component<StudentViewComponentProps> = $derived(
		studentViewComponents[presentation.slideIndex]
	);
	let StudentInteractComponent: Component<StudentInteractComponentProps> = $derived(
		studentInteractComponents[presentation.slideIndex]
	);

	let unsubscribes: UnsubscribeFunc[] = $state([]);
	const handleClassroomActivitySubscription = (data: RecordSubscription, index: number) => {
		if (data.action !== 'update') return;
		classroomActivityArray[index].loadNewRecord(data.record as ActivityClassroomPB);
		classroomActivityArray[index] = Object.create(classroomActivityArray[index]);
		classroomActivityArray = [...classroomActivityArray];
	};

	const handleStudentActivitySubscription = (data: RecordSubscription, index: number) => {
		if (data.action !== 'update') return;
		studentActivityArray[index].loadNewRecord(data.record as ActivityStudentPB);
		studentActivityArray[index] = Object.create(studentActivityArray[index]);
		studentActivityArray = [...studentActivityArray];
	};

	onMount(async () => {
		resetZoom();
		await presentation.subscribe((subRecord) => {
			if (subRecord.action !== 'update') return;
			presentation.record = subRecord.record;
			presentation = Object.create(presentation);
		});
		await classroomActivityArray.forEach(async (record, index) => {
			const unsubscribe = await subscribeToActivityRecord<ActivityClassroomPB>(
				'classroom_activity',
				record.id,
				(data) => handleClassroomActivitySubscription(data, index)
			);
			unsubscribes.push(unsubscribe);
		});
		await studentActivityArray.forEach(async (record, index) => {
			const unsubscribe = await subscribeToActivityRecord<ActivityStudentPB>(
				'student_activity',
				record.id,
				(data) => handleStudentActivitySubscription(data, index)
			);
			unsubscribes.push(unsubscribe);
		});
	});

	onDestroy(async () => {
		// presentation.unsubscribe();
		console.log('unsubscribeArray', unsubscribes);
	});
	//

	let wrapper = $state<HTMLDivElement | null>(null);
	let scale = $state(1);
	const scaleFactor = 0.98; // optional factor to add some padding
	let wrapperStyle = $derived({
		// svelte-ignore state_referenced_locally
		transform: `scale(${scale})`,
		'transform-origin': 'center center'
	});

	function zoomIn() {
		scale = Math.min(scale + 0.05, 2); // cap at 200%
	}

	function zoomOut() {
		scale = Math.max(scale - 0.05, 0.1); // floor at 10%
	}

	const contentWidth = 1920;
	let contentHeight = $derived(!!StudentInteractComponent ? 2300 : 1080);
	function resetZoom() {
		wrapper = document.getElementById('slide-wrapper') as HTMLDivElement;
		const scaleWidth = wrapper.clientWidth / contentWidth;
		const scaleHeight = wrapper.clientHeight / contentHeight;
		scale = Math.min(scaleWidth, scaleHeight) * scaleFactor;
	}

	// const preventedKeys = ['ArrowLeft', 'ArrowRight'];
	// const OnKeyDown = (event: KeyboardEvent) => {
	// 	const key = event.key;
	// 	if (preventedKeys.includes(key)) event.preventDefault();
	// 	switch (key) {
	// 		case 'ArrowLeft':
	// 			return moveSlide(-1);
	// 		case 'ArrowRight':
	// 			return moveSlide(1);
	// 		default:
	// 			return;
	// 	}
	// };

	let slideIndex: number = $derived(presentation.slideIndex ?? 0);
	// const moveSlide = (num: number) => {
	// 	presentation.moveSlide(slides.length, num);
	// };
</script>

<StudentSlideWrapper
	{classroom}
	{deck}
	{presentation}
	slide={slides[presentation.slideIndex]}
	{students}
	{teachers}
	{guests}
	{SlideComponent}
	ControlComponent={StudentInteractComponent}
	classroomActivity={classroomActivityArray[presentation.slideIndex]}
	studentActivity={studentActivityArray[presentation.slideIndex]}
	styleRecord={wrapperStyle}
/>

<!-- Scale Controls -->
<div
	class="fixed right-4 top-4 z-50 flex select-none items-center space-x-2 rounded bg-black/60 p-2"
>
	<!-- <button
		class="rounded bg-white px-2 py-1 text-black hover:bg-gray-200"
		onclick={zoomOut}
		aria-label="Zoom out"
	>
		<span class="select-none"> − </span>
	</button> -->

	<button
		class="rounded bg-white px-2 py-1 text-black hover:bg-gray-200"
		onclick={resetZoom}
		aria-label="Reset zoom"
	>
		<span class="select-none"> ↻ </span>
	</button>
	<!-- <button
		class="rounded bg-white px-2 py-1 text-black hover:bg-gray-200"
		onclick={zoomIn}
		aria-label="Zoom in"
	>
		<span class="select-none"> + </span>
	</button> -->
</div>
