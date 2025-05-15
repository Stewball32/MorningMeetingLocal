<script lang="ts">
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import { onMount } from 'svelte';
	import type { ClassProps } from './_types';
	import { getPronounPresent, getPronounSubject, makeSearchParams } from '$lib';
	import PersonBar from '$lib/slides/attendance/PersonBar.svelte';
	import PersonButton from '$lib/buttons/PersonButton.svelte';

	interface WhoIsHereProps {
		from?: 'left' | 'right';
		people: Student[] | Teacher[];
		dailyMap: Map<string, StudentDaily | TeacherDaily>;
		updateAttendance: (person: Student | Teacher | undefined, isHere: boolean) => Promise<void>;
		currentPerson: Student | Teacher | undefined;
		title?: string;
		subtitle?: string;
		prompt?: string;
		pageLeft?: () => void;
		pageRight?: () => void;
		updateClassDailySlide: (
			column: string,
			partialClassDaily: Partial<ClassProps>
		) => Promise<void>;
	}

	let {
		people,
		dailyMap,
		updateAttendance,
		currentPerson = $bindable(undefined),
		title = 'Attendance',
		subtitle = 'Part 1: Students',
		prompt = 'Click on a button!',
		pageLeft = () => {},
		pageRight = () => {},
		updateClassDailySlide: updateClassDailySlide = async (
			column: string,
			partialClassDaily: Partial<ClassProps>
		) => {}
	}: WhoIsHereProps = $props();

	const youtubeUrl = (person: Student | Teacher, embedded: boolean = true) => {
		const videoId = person.video_id;
		const start = person.video_start ? `&start=${person.video_start}` : '';
		const end = person.video_end ? `&end=${person.video_end}` : '';
		const baseUrl = embedded
			? 'https://www.youtube.com/embed/'
			: 'https://www.youtube.com/watch?v=';
		return `${baseUrl}${videoId}?rel=0&enablejsapi=1&autoplay=0${start}${end}`;
	};

	const updateCurrentPerson = (person?: Student | Teacher) => {
		currentPerson = person;
		const updatedProps = { currentPerson: person?.id };
		updateClassDailySlide('attendance', updatedProps);
	};

	let collectionNames: string[] = $state([]);
	onMount(() => {
		people.forEach((person) => {
			if (!collectionNames.includes(person.collectionName)) {
				collectionNames.push(person.collectionName);
			}
		});
	});

	const getPersonIndex = (person: Student | Teacher) => {
		return people.findIndex((p) => p.id === person.id);
	};

	const getButtonPreset = (person: Student | Teacher) => {
		const daily = dailyMap.get(person.id);
		if (!daily) return 'surface';
		if (daily.here === 'present') return 'success';
		if (daily.here === 'absent') return 'error';
		return 'surface';
	};

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!currentPerson) return;
			updateAttendance(currentPerson, true);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!currentPerson) return;
			updateAttendance(currentPerson, false);
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			let newPerson: Student | Teacher | undefined;
			if (currentPerson === undefined) {
				newPerson = people[people.length - 1];
			} else {
				const currentPersonIndex = getPersonIndex(currentPerson);
				if (currentPersonIndex === -1) newPerson = people[people.length - 1];
				else newPerson = people[currentPersonIndex - 1];
			}
			if (!newPerson) return pageLeft();
			updateCurrentPerson(newPerson);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			let newPerson: Student | Teacher | undefined;
			if (currentPerson === undefined) {
				newPerson = people[0];
			} else {
				const currentPersonIndex = getPersonIndex(currentPerson);
				if (currentPersonIndex === -1) newPerson = people[0];
				else newPerson = people[currentPersonIndex + 1];
			}
			if (!newPerson) return pageRight();
			updateCurrentPerson(newPerson);
		}
	}
</script>

<svelte:window on:keydown={onKeydown} />

<PersonBar {people} {dailyMap} {currentPerson} onClick={updateCurrentPerson} />
{#if currentPerson && collectionNames.includes(currentPerson.collectionName)}
	<div class="h-8/12 top-2/12 absolute flex w-full flex-col justify-center py-2">
		<div class="h-9/12 flex w-full items-center justify-center pb-2">
			<!--iFrame of youtube video with 16/9 ratio-->
			<iframe
				class="rounded-4xl aspect-video h-full"
				src={youtubeUrl(currentPerson)}
				title="YouTube video player"
				frameborder="0"
				allowfullscreen
			></iframe>
		</div>
		<div class="h-3/12 flex w-full items-center justify-center gap-2">
			<h1 class="text-size-6 font-bold">Is</h1>
			<PersonButton
				person={currentPerson}
				buttonPreset={getButtonPreset(currentPerson)}
				buttonClass="h-full"
				avatarClass="-px-6"
				nameClass="text-size-6 font-bold"
				onClick={() => updateCurrentPerson(undefined)}
			/>
			<h1 class="text-size-6 font-bold">here today?</h1>
		</div>
	</div>

	<div class="h-2/12 absolute bottom-0 flex w-full justify-evenly pt-1">
		<button
			onclick={() => updateAttendance(currentPerson, true)}
			class="btn preset-filled-success-500 text-size-4 col-span-2 w-1/4 rounded-full border font-semibold"
		>
			{getPronounSubject(currentPerson)}
			{getPronounPresent(currentPerson)}
			here!
		</button>
		<a
			href={youtubeUrl(currentPerson, false)}
			target="_blank"
			rel="noopener noreferrer"
			class="btn col-span-1 overflow-hidden rounded-full"
		>
			<img class="h-full rounded-full" src="/youtube.png" alt="" />
		</a>
		<button
			onclick={() => updateAttendance(currentPerson, false)}
			class="btn preset-filled-error-500 text-size-4 col-span-2 w-1/4 rounded-full border font-semibold"
		>
			{getPronounSubject(currentPerson)}
			{getPronounPresent(currentPerson) + "n't"}
			here.
		</button>
	</div>
{:else}
	<div class="h-10/12 top-2/12 absolute flex w-full cursor-default flex-col justify-center py-2">
		<div class="flex h-full w-full flex-col items-center justify-around">
			<h1 class="text-size-8 text-center font-black">{title}</h1>
			<h2 class="text-size-7 text-normal text-balance text-center font-extrabold">{subtitle}</h2>
			<h3 class="text-size-4 hidden text-balance py-[5%] text-center font-semibold italic sm:block">
				{prompt}
			</h3>
		</div>
	</div>
{/if}
