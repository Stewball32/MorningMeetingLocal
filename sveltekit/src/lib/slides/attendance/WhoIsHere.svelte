<script lang="ts">
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import { onMount } from 'svelte';
	import PersonButton from '$lib/PersonButton.svelte';
	import { getPronounPresent, getPronounSubject } from '$lib';
	import PersonBar from '$lib/slides/attendance/PersonBar.svelte';

	interface WhoIsHereProps {
		people: Student[] | Teacher[];
		dailyMap: Map<string, StudentDaily | TeacherDaily>;
		updateAttendance: (person: Student | Teacher | undefined, isHere: boolean) => Promise<void>;
		currentPerson: Student | Teacher | undefined;
		title?: string;
		subtitle?: string;
		prompt?: string;
		pageLeft?: () => void;
		pageRight?: () => void;
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
		pageRight = () => {}
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
	};

	let collectionNames: string[] = $state([]);
	onMount(() => {
		currentPerson = undefined;
		people.forEach((person) => {
			if (!collectionNames.includes(person.collectionName)) {
				collectionNames.push(person.collectionName);
			}
		});
	});

	const getPersonIndex = (person: Student | Teacher) => {
		return people.findIndex((p) => p.id === person.id);
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
			let currentPersonIndex: number;
			if (currentPerson === undefined) {
				currentPerson = people[people.length - 1];
				currentPersonIndex = getPersonIndex(currentPerson) + 1;
			} else currentPersonIndex = getPersonIndex(currentPerson);
			for (let i = currentPersonIndex - 1; i >= 0; i--) {
				if (!dailyMap.get(people[i].id)?.here) {
					updateCurrentPerson(people[i]);
					return;
				}
			}
			if (currentPersonIndex !== 0) {
				updateCurrentPerson(people[currentPersonIndex - 1]);
			} else pageLeft();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			if (currentPerson === undefined) currentPerson = people[0];
			let currentPersonIndex = getPersonIndex(currentPerson);
			for (let i = currentPersonIndex + 1; i < people.length; i++) {
				if (!dailyMap.get(people[i].id)?.here) {
					updateCurrentPerson(people[i]);
					return;
				}
			}
			// if no more people, go to the next page
			if (currentPersonIndex !== people.length - 1) {
				updateCurrentPerson(people[currentPersonIndex + 1]);
			} else pageRight();
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
			<h1 class="text-question">Is</h1>
			<PersonButton
				person={currentPerson}
				daily={currentPerson ? dailyMap.get(currentPerson.id) : undefined}
				style="h-full "
				showAvatar={true}
				avatarStyle="h-full -px-6"
				showName={true}
				nameStyle="text-question"
				onClick={() => updateCurrentPerson(undefined)}
			/>
			<h1 class="text-question">here today?</h1>
		</div>
	</div>

	<div class="h-2/12 absolute bottom-0 flex w-full justify-evenly pt-1">
		<button
			onclick={() => updateAttendance(currentPerson, true)}
			class="btn preset-filled-success-500 text-answer col-span-2 rounded-full border"
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
			class="btn preset-filled-error-500 text-answer col-span-2 rounded-full border"
		>
			{getPronounSubject(currentPerson)}
			{getPronounPresent(currentPerson) + "n't"}
			here.
		</button>
	</div>
{:else}
	<div class="h-10/12 top-2/12 absolute flex w-full flex-col justify-center py-2">
		<div class="flex h-full w-full flex-col items-center justify-around">
			<h1 class="text-title text-center">{title}</h1>
			<h2 class="text-subtitle text-normal text-balance text-center">{subtitle}</h2>
			<h3 class="text-answer hidden text-balance py-[5%] text-center italic sm:block">{prompt}</h3>
		</div>
	</div>
{/if}
