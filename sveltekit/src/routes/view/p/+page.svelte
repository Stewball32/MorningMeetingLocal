<script lang="ts">
	import { onDestroy, onMount, type Component } from 'svelte';
	import type { PageData } from './$types';
	import type { SlideComponentProps } from '$lib/slides';
	import type { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
	import { subscribeToActivityRecord } from '$lib/pb/records';
	import type {
		ActivityClassroomPB,
		ActivityGuestPB,
		ActivityStudentPB,
		ActivityTeacherPB
	} from '$lib/pb/types';
	import ClassSlideWrapper from '$lib/slides/ClassSlideWrapper.svelte';
	import type { GuestActivity, StudentActivity, TeacherActivity } from '$lib/pb/objects';

	let { data }: { data: PageData } = $props();

	const { classroom, deck, guests, students, teachers, slideComponents, slides } = data;
	let classroomActivityArray = $state(data.classroomActivityArray || []);
	let peopleActivityMaps = $state(data.peopleActivityMaps || []);
	let presentation = $state(data.presentation || {});

	const unsubscribes: UnsubscribeFunc[] = $state([]);
	const handleClassroomActivitySubscription = (data: RecordSubscription, index: number) => {
		if (data.action !== 'update') return;
		classroomActivityArray[index].loadNewRecord(data.record as ActivityClassroomPB);
		classroomActivityArray[index] = Object.create(classroomActivityArray[index]);
		classroomActivityArray = [...classroomActivityArray];
	};
	const handlePeopleActivitySubscription = (data: RecordSubscription, index: number) => {
		if (data.action !== 'update') return;
		const activityMap = peopleActivityMaps[index];
		const record = data.record;
		const personActivityRecord = activityMap
			.values()
			.find((Activity) => Activity.id === data.record.id) as
			| StudentActivity
			| TeacherActivity
			| GuestActivity;

		let cloneActivity: StudentActivity | TeacherActivity | GuestActivity;

		if (personActivityRecord.collectionName === 'student_activity') {
			cloneActivity = cloneStudentActivity(
				data.record as ActivityStudentPB,
				personActivityRecord as StudentActivity
			);
		} else if (personActivityRecord.collectionName === 'teacher_activity') {
			cloneActivity = cloneTeacherActivity(
				data.record as ActivityTeacherPB,
				personActivityRecord as TeacherActivity
			);
		} else if (personActivityRecord.collectionName === 'guest_activity') {
			cloneActivity = cloneGuestActivity(
				data.record as ActivityGuestPB,
				personActivityRecord as GuestActivity
			);
		} else {
			console.error('Unknown activity type:', personActivityRecord.collectionName);
			return;
		}
		peopleActivityMaps[index].set(data.record.id, cloneActivity);
		peopleActivityMaps[index] = new Map(peopleActivityMaps[index]);
		peopleActivityMaps = [...peopleActivityMaps];
	};

	const cloneGuestActivity = (record: ActivityGuestPB, guestActivity: GuestActivity) => {
		guestActivity.loadNewRecord(record);
		return Object.create(guestActivity);
	};

	const cloneStudentActivity = (record: ActivityStudentPB, studentActivity: StudentActivity) => {
		studentActivity.loadNewRecord(record);
		return Object.create(studentActivity);
	};

	const cloneTeacherActivity = (record: ActivityTeacherPB, teacherActivity: TeacherActivity) => {
		teacherActivity.loadNewRecord(record);
		return Object.create(teacherActivity);
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
		await peopleActivityMaps.forEach(async (activityMap, index) => {
			await activityMap.values().forEach(async (personActivityRecord) => {
				const unsubscribe = await subscribeToActivityRecord(
					personActivityRecord.collectionName,
					personActivityRecord.id,
					(data) => handlePeopleActivitySubscription(data, index)
				);
				unsubscribes.push(unsubscribe);
			});
		});
	});

	onDestroy(() => {
		// presentation.unsubscribe();
		// unsubscribes.forEach((unsubscribe) => unsubscribe());
	});

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

	function resetZoom() {
		wrapper = document.getElementById('slide-wrapper') as HTMLDivElement;
		const scaleWidth = wrapper.clientWidth / 1920; // your slide width
		const scaleHeight = wrapper.clientHeight / 1080; // your slide height
		scale = Math.min(scaleWidth, scaleHeight) * scaleFactor;
	}

	const preventedKeys = ['ArrowLeft', 'ArrowRight'];
	const OnKeyDown = (event: KeyboardEvent) => {
		const key = event.key;
		if (preventedKeys.includes(key)) event.preventDefault();
		switch (key) {
			case 'ArrowLeft':
				return moveSlide(-1);
			case 'ArrowRight':
				return moveSlide(1);
			default:
				return;
		}
	};

	const moveSlide = (num: number) => {
		presentation.moveSlide(slides.length, num);
	};

	let CurrentSlideComponent: Component<SlideComponentProps> = $derived(
		slideComponents[presentation.slideIndex]
	);
</script>

<ClassSlideWrapper
	{classroom}
	{deck}
	{presentation}
	slide={slides[presentation.slideIndex]}
	{students}
	{teachers}
	{guests}
	SlideComponent={CurrentSlideComponent}
	classroomActivity={classroomActivityArray[presentation.slideIndex]}
	personActivityMap={peopleActivityMaps[presentation.slideIndex]}
	{moveSlide}
	styleRecord={wrapperStyle}
/>

<!-- Scale Controls -->
<div
	class="fixed right-4 top-4 z-50 flex select-none items-center space-x-2 rounded bg-black/60 p-2"
>
	<button
		class="rounded bg-white px-2 py-1 text-black hover:bg-gray-200"
		onclick={zoomOut}
		aria-label="Zoom out"
	>
		<span class="select-none"> − </span>
	</button>

	<button
		class="rounded bg-white px-2 py-1 text-black hover:bg-gray-200"
		onclick={resetZoom}
		aria-label="Reset zoom"
	>
		<span class="select-none"> ↻ </span>
	</button>
	<button
		class="rounded bg-white px-2 py-1 text-black hover:bg-gray-200"
		onclick={zoomIn}
		aria-label="Zoom in"
	>
		<span class="select-none"> + </span>
	</button>
</div>
