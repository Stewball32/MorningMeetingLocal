<script lang="ts">
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	import Reveal from 'reveal.js'; // Default import for Reveal.js
	import { onMount } from 'svelte';
	import LinedPaper from '$lib/linedpaper.svelte';
	
	type PropData = {
		id?: string;
		animate?: boolean;
		restart?: boolean;
	};
	let { id = 'attendance', animate = true, restart = false }: PropData = $props();

	// let id: string | null = 'attendance';
	// let animate = true;
	// let restart = true;

	let yay: HTMLAudioElement;
	let aww: HTMLAudioElement;

	interface Person {
		index?: number;
		type: 'student' | 'teacher';
		name: string;
		title?: string;
		pronoun: string;
		present: boolean | null;
		video?: string;
		start?: number;
		end?: number;
	}

	let Students: Person[] = $state([
		{
			type: 'student',
			name: 'Avyaan',
			pronoun: 'he',
			present: null,
			video: 'E8WaFvwtphY',
			start: 131,
			end: 155
		},
		{
			type: 'student',
			name: 'Dylan',
			pronoun: 'he',
			present: null,
			video: 'F3lTTdkpgxs',
			start: 0,
			end: 24
		},
		{
			type: 'student',
			name: 'John',
			pronoun: 'he',
			present: null,
			video: '_BlkTSKqE_8',

			start: 15,
			end: 53
		},
		{
			type: 'student',
			name: 'Gia',
			pronoun: 'she',
			present: null,
			video: 'IMEwzzyBP7w',
			start: 39,
			end: 77
		},
		{
			type: 'student',
			name: 'Huxely',
			pronoun: 'she',
			present: null,
			video: 'dtMesafhSYI',
			start: 6,
			end: 0
		},
		{
			type: 'student',
			name: 'Miracle',
			pronoun: 'she',
			present: null,
			video: '8nv1m-aTCZI',
			start: 0,
			end: 24
		}
	]);
	let Teachers: Person[] = $state([
		{
			type: 'teacher',
			name: 'Casey',
			title: 'Mr.',
			pronoun: 'he',
			present: null,
			video: 'mLsUEJPXubc',
			start: 38,
			end: 58
		},
		{
			type: 'teacher',
			name: 'Natalie',
			title: 'Ms.',
			pronoun: 'she',
			present: null,
			video: 'kXB-Ibr55LI',
			start: 24,
			end: 49
		},
		{
			type: 'teacher',
			name: 'Kendall',
			title: 'Ms.',
			pronoun: 'she',
			present: null,
			video: 'mAh0Y9UdQZI',
			start: 81,
			end: 104
		},
		{
			type: 'teacher',
			name: 'Stewart',
			title: 'Mr.',
			pronoun: 'he',
			present: null,
			video: 'Ye8mB6VsUHw',
			start: 10,
			end: 27
		},
		{
			type: 'teacher',
			name: 'Suany',
			title: 'Ms.',
			pronoun: 'she',
			present: null,
			video: 'zb47CstE7R4',
			start: 11,
			end: 45
		},
		{
			type: 'teacher',
			name: 'Guest',
			title: 'our',
			pronoun: 'they',
			present: null,
			video: 'oWgTqLCLE8k',
			start: 58,
			end: 0
		}
	]);

	let currentIndex = 0;
	// @ts-ignore
	Reveal.on('slidechanged', (event: any) => {
		// const previousSlide = event.previousSlide;
		// const currentSlide = event.currentSlide;
		// const vIndex = event.indexv;
		// if (vIndex && vIndex < people.length + 1) {
		// 	// Set the background iframe on the current slide
		// 	Reveal.syncSlide(currentSlide);
		// }
		// for (let i = 0; i < people.length; i++) {
		// 	if (people[i].index === event.indexv) {
		// 		currentIndex = people[i].index;
		// 		break;
		// 	}
		// }
		// currentIndex = 0; // Reset the current index
	});


	let people: Person[] = $derived([...Students, ...Teachers].map((person, index) => ({
		...person,
		index: index + 1 // Adding 1 to make it 1-based
	})))

	let allPeople: Person[] = $derived(people.filter((person) => person.index !== currentIndex));
	let peopleHere: Person[] = $derived(
		people.filter((person) => person.present === true && person.index !== currentIndex)
	);
	let peopleAbsent: Person[] = $derived(
		people.filter((person) => person.present === false && person.index !== currentIndex)
	);

	const togglePresent = (person: Person) => {
		if (person.present === true) {
			person.present = null;
		} else {
			person.present = true;
			yay.play();
		}
		updatePerson(person);
	};

	const toggleAbsent = (person: Person) => {
		if (person.present === false) {
			person.present = null;
		} else {
			person.present = false;
			aww.play();
		}
		updatePerson(person);
	};

	const updatePerson = (person: Person) => {
		switch (person.type) {
			case 'student':
				Students.forEach((student, index) => {
					if (student.name === person.name) {
						Students[index] = person;
					}
				});
				break;
			case 'teacher':
				Teachers.forEach((teacher, index) => {
					if (teacher.name === person.name) {
						Teachers[index] = person;
					}
				});
				break;
		}
	};

	onMount(() => {
		yay = new Audio('/yay.mp3');
		aww = new Audio('/aww.mp3');
		Reveal.initialize(); // Initialize Reveal.js
		Reveal.sync();
	});

	// Navigate to a specific vertical slide based on person's index
	function goToSlide(vIndex: number | undefined) {
		if (!vIndex) return;
		const currentIndices = Reveal.getIndices();
		const hIndex = currentIndices.h;
		Reveal.slide(hIndex, vIndex);
		Reveal.sync();
	}
	const baseCss = 'h1 rounded-full px-4';
	
	const personCss = (person: Person) => {
		switch (person.present) {
			case true:
				return `${baseCss} preset-tonal-success`;
			case false:
				return `${baseCss} preset-tonal-error`;
			case null:
				return `${baseCss} preset-outlined-surface-300-700`;
		}
	};

	let hereCols = $derived(peopleHere.length > 6 ? 'grid-cols-3' : peopleHere.length > 3 ? 'grid-cols-2' : 'grid-cols-1');
	let absentCols = $derived(peopleAbsent.length > 6 ? 'grid-cols-3' : peopleAbsent.length > 3 ? 'grid-cols-2' : 'grid-cols-1');

</script>

<section
	class=" flex h-full w-full flex-col"
	data-auto-animate-id={id}
	data-auto-animate={animate || null}
	data-auto-animate-restart={restart || null}
>
	<LinedPaper />

	<section
		data-auto-animate
		class="flex h-full flex-col items-stretch justify-evenly px-[6%] py-[3%]"
	>
		<div data-id="people-bar" class="h-1/12 flex w-full flex-row justify-evenly">
			{#each allPeople as person}
				{#if person.present === true}
					<button
						onclick={() => goToSlide(person.index)}
						class="card btn-sm preset-tonal-success m-1 flex h-auto flex-col items-center p-2 outline-8"
					>
						{#if person.title}
							<span class="text-center text-xs">{person.title}</span>
							<span class="text-center">{person.name}</span>
						{:else}
							<span class="m-0 my-0 inline p-0 py-2 text-center">{person.name}</span>
						{/if}
					</button>
				{:else if person.present === null}
					<button
						onclick={() => goToSlide(person.index)}
						class="card btn-sm preset-outlined-surface-300-700 m-1 flex h-auto flex-col items-center p-2"
					>
						{#if person.title}
							<span class="text-center text-xs">{person.title}</span>
							<span class="text-center">{person.name}</span>
						{:else}
							<span class="m-0 my-0 inline p-0 py-2 text-center">{person.name}</span>
						{/if}
					</button>
				{:else if person.present === false}
					<button
						onclick={() => goToSlide(person.index)}
						class="card btn-sm preset-tonal-error m-1 flex h-auto flex-col items-center p-2"
					>
						{#if person.title}
							<span class="text-center text-xs">{person.title}</span>
							<span class="text-center">{person.name}</span>
						{:else}
							<span class="m-0 my-0 inline p-0 py-2 text-center">{person.name}</span>
						{/if}
					</button>
				{/if}
			{/each}
		</div>
		<div class="flex h-[90%] w-full flex-col items-center justify-center">
			<span class="h1 text-9xl font-bold">Let's Take Attendance!</span>
		</div>
	</section>

	{#each people as currentPerson (currentPerson.index)}
		<section
			data-auto-animate
			class="flex h-full flex-col items-stretch justify-evenly px-[6%] py-[3%]"
		>
			<div data-id="people-bar" class=" flex w-full flex-row justify-evenly">
				{#each allPeople as person}
					{#if person.present === true}
						<button
							data-id={person.index}
							onclick={() => goToSlide(person.index)}
							class="card btn-sm preset-tonal-success m-1 flex h-auto flex-col items-center p-2"
						>
							{#if person.title}
								<span class="text-center text-xs">{person.title}</span>
								<span class="text-center">{person.name}</span>
							{:else}
								<span class="m-0 my-0 inline p-0 py-2 text-center">{person.name}</span>
							{/if}
						</button>
					{:else if person.present === null}
						<button
							data-id={person.index}
							onclick={() => goToSlide(person.index)}
							class="card btn-sm preset-outlined-surface-300-700 m-1 flex h-auto flex-col items-center p-2"
						>
							{#if person.title}
								<span class="text-center text-xs">{person.title}</span>
								<span class="text-center">{person.name}</span>
							{:else}
								<span class="m-0 my-0 inline p-0 py-2 text-center">{person.name}</span>
							{/if}
						</button>
					{:else if person.present === false}
						<button
							data-id={person.index}
							onclick={() => goToSlide(person.index)}
							class="card btn-sm preset-tonal-error m-1 flex h-auto flex-col items-center p-2"
						>
							{#if person.title}
								<span class="text-center text-xs">{person.title}</span>
								<span class="text-center">{person.name}</span>
							{:else}
								<span class="m-0 my-0 inline p-0 py-2 text-center">{person.name}</span>
							{/if}
						</button>
					{/if}
				{/each}
			</div>

			<div class=" m-4 h-[70%] w-full pb-10">
				<!-- svelte-ignore a11y_missing_attribute -->
				<iframe
					class="h-[95%] w-full"
					frameborder="0"
					src={`https://www.youtube.com/embed/${currentPerson.video}?rel=0&enablejsapi=1&autoplay=0${currentPerson.start ? `&start=${currentPerson?.start}` : ''} ${currentPerson.end ? `&end=${currentPerson?.end}` : ''}`}
				></iframe>
				<div class="flex flex-row justify-center">
					<div class="mt-1 flex h-1/6 flex-row items-center justify-center align-middle">
						{#if currentPerson.present === null}
							<span class="h2 align-middle text-5xl" data-id="where-is">Where is</span>
							<span class="w-4"></span>
						{/if}
						<button
							data-transition="zoom"
							data-id={currentPerson.name}
							class={personCss(currentPerson)}
						>
							<span
								class="h2"
								style={currentPerson.present === null ? 'color: black;' : 'color: white;'}
							>
								{#if currentPerson.title}
									{currentPerson.title}&nbsp;
								{/if}{currentPerson.name}
							</span>
						</button>
						{#if currentPerson.present === null}
							<span data-id="current?" class="h1 pt-1 align-middle text-5xl">?</span>
						{:else if currentPerson.present === true}
							<span class="w-4"></span>
							<span class="h2 align-middle text-5xl" data-id="is-here">is here!</span>
						{:else if currentPerson.present === false}
							<span class="w-4"></span>
							<span class="h2 align-middle text-5xl" data-id="is-here">is not here.</span>
						{/if}
					</div>
				</div>
			</div>

			<div class="mt-0 grid h-[10%] grid-cols-5 gap-4">
				<!-- Reuse the same ID for the present/absent buttons to avoid animation issues -->
				<button
					data-id="present"
					data-auto-animate-id="present-button"
					onclick={() => togglePresent(currentPerson)}
					class=" preset-tonal-success col-span-2 rounded-xl"
				>
					Here
				</button>
				<a
					data-id="youtube"
					data-auto-animate-id="youtube-button"
					class="preset-tonal-surface col-span-1 flex flex-row items-center justify-center rounded-xl"
					href={`https://youtu.be/${currentPerson.video}?t=${currentPerson.start ?? 0}`}
					target="_blank"
				>
					<img src="/youtube.png" alt="YouTube" class="h-6" />
				</a>
				<button
					data-id="absent"
					data-auto-animate-id="absent-button"
					onclick={() => toggleAbsent(currentPerson)}
					class=" preset-tonal-error col-span-2 rounded-xl"
				>
					Not Here
				</button>
			</div>
		</section>
	{/each}

	<section
		data-auto-animate
		class="flex h-full flex-col items-stretch justify-evenly px-[6%] py-[3%]"
	>
		<span class="h1 h-[35%] text-8xl font-bold">Attendance Complete!</span>
		<div class="flex h-[55%] w-full flex-col items-center justify-start">
			<div class=" grid grid-flow-row grid-cols-2 gap-5">
				<div class="flex flex-col justify-start align-top">
					<span class="text-5xl">Here</span>
					<div class={"grid grid-flow-row justify-center align-top " + hereCols}>
						{#each peopleHere as person}
							<button
								data-id={person.index}
								onclick={() => goToSlide(person.index)}
								class="card btn-lg preset-tonal-success m-1 flex h-auto flex-row items-center justify-center p-2"
							>
								{#if person.title}
									<span class="m-0 my-0 inline p-0 py-2 text-center"
										>{person.title} {person.name}</span
									>
								{:else}
									<span class="m-0 my-0 inline p-0 py-2 text-center">{person.name}</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
				<div class="flex flex-col justify-start align-top">
					<span class="text-5xl">Not Here</span>
					<div class={"grid grid-flow-row justify-center align-top " + absentCols}>
						{#each peopleAbsent as person}
							<button
								data-id={person.index}
								onclick={() => goToSlide(person.index)}
								class="card btn-lg preset-tonal-error m-1 flex h-auto flex-row items-center justify-center p-2"
							>
								{#if person.title}
									<span class="m-0 my-0 inline p-0 py-2 text-center"
										>{person.title} {person.name}</span
									>
								{:else}
									<span class="m-0 my-0 inline p-0 py-2 text-center">{person.name}</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<span class="h-[10%]">Thank you for taking attendance!</span>
	</section>
</section>
