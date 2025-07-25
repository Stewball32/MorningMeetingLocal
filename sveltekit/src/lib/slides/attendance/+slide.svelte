<script lang="ts">
	import { onMount } from 'svelte';
	import { transformStringWithPerson } from '$lib';
	import type { ClassActivityDataType, SlideComponentPropsWrapper } from './_types';
	import { ClassroomActivity, type Guest, type Student, type Teacher } from '$lib/pb/objects';
	import UndoIcon from '@lucide/svelte/icons/undo';
	import Underline from '$lib/decorations/Underline.svelte';
	import PersonButton from '$lib/buttons/PersonButton.svelte';
	import Creature from '$lib/decorations/Creature.svelte';
	import Squiggle from '$lib/decorations/Squiggle.svelte';

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

	let {
		title = "Let's take Attendance!",
		subtitle = 'Who is here today?',
		paragraph = 'Click on a person below...',
		roster = ['students'],
		pQuestion = 'Is {name} here?',
		pHereString = '{Subject} is here',
		pAbsentString = '{Subject} is not here',
		pIsHereString = 'Good Morning, {name}!',
		pIsAbsentString = '{Name} is not here.'
	} = $derived(slide.config);

	let {
		currentPersonId = '',
		hereIds = [],
		absentIds = []
	} = $derived(classroomActivity.data || {});

	let people = $state<(Student | Teacher | Guest)[]>([]);
	let peopleRows = $state<(Student | Teacher | Guest)[][]>([]);
	let currentPerson: Student | Teacher | Guest | undefined = $derived(
		people.find((person) => person.id === currentPersonId)
	);
	let currentAttendance: string = $derived(
		hereIds.includes(currentPerson?.id || '')
			? 'here'
			: absentIds.includes(currentPerson?.id || '')
				? 'absent'
				: ''
	);

	let currentHereVotes: (Student | Teacher | Guest)[] = $state([]);
	let currentAbsentVotes: (Student | Teacher | Guest)[] = $state([]);
	$effect(() => {
		if (!currentPerson) {
			currentHereVotes = [];
			currentAbsentVotes = [];
			return;
		}
		let newHereVotes: (Student | Teacher | Guest)[] = [];
		let newAbsentVotes: (Student | Teacher | Guest)[] = [];
		personActivityMap?.entries().forEach(([personId, activity]) => {
			if (activity.data?.hereVotes?.includes(currentPerson.id)) {
				const person = people.find((p) => p.id === personId);
				if (person) newHereVotes.push(person);
			}
			if (activity.data?.absentVotes?.includes(currentPerson.id)) {
				const person = people.find((p) => p.id === personId);
				if (person) newAbsentVotes.push(person);
			}
		});
		currentHereVotes = newHereVotes;
		currentAbsentVotes = newAbsentVotes;
	});

	onMount(() => {
		for (const role of roster) {
			switch (role) {
				case 'students':
					people.push(...students);
					break;
				case 'teachers':
					people.push(...teachers);
					break;
				case 'guests':
					people.push(...guests);
					break;
				default:
					continue;
			}
		}
		const totalPeople = people.length;
		// 1 row if less than 10, people split evenly into rows if more than 10. max 10 people per row
		const peoplePerRow = totalPeople < 10 ? 1 : Math.ceil(totalPeople / 10);
		peopleRows = Array.from({ length: peoplePerRow }, (_, i) =>
			people.slice(i * (totalPeople / peoplePerRow), (i + 1) * (totalPeople / peoplePerRow))
		);
	});

	const pHeight = $derived(
		peopleRows.length > 1
			? 'h-28'
			: peopleRows[0].length < 7
				? 'h-52'
				: peopleRows[0].length < 9
					? 'h-42'
					: 'h-32'
	);

	const updateCurrentPerson = async (person: Student | Teacher | Guest) => {
		const newCurrentPersonId = currentPersonId === person.id ? '' : person.id;
		await classroomActivity.updateData({
			currentPersonId: newCurrentPersonId
		});
	};

	const updateAttendance = async (status: 'here' | 'absent' | '') => {
		if (!currentPerson) return;
		const newData: Partial<ClassActivityDataType> = {};
		const oldStatus = currentAttendance;
		newData.hereIds = [...hereIds].filter((id) => id !== currentPerson.id);
		newData.absentIds = [...absentIds].filter((id) => id !== currentPerson.id);
		if (status && status !== oldStatus) {
			(newData[`${status}Ids`] || []).push(currentPerson.id);
		}
		await classroomActivity.updateData(newData);
	};

	// const getYoutubeEmbedUrl = (person: Student | Teacher | Guest) => {
	// 	if (!person.videoEmbedUrl) return '';
	// 	return person.videoEmbedUrl;
	// };

	const youtubeUrl = (person: Student | Teacher | Guest, embedded: boolean = true) => {
		const videoId = person.videoId;
		const start = person.videoStart ? `&start=${person.videoStart}` : '';
		const end = person.videoEnd ? `&end=${person.videoEnd}` : '';
		const baseUrl = embedded
			? 'https://www.youtube.com/embed/'
			: 'https://www.youtube.com/watch?v=';
		const url = `${baseUrl}${videoId}?rel=0&enablejsapi=1&autoplay=0${start}${end}`;
		console.log('Generated YouTube URL:', url);
		return url;
	};

	let personQuestion = $state<string>('');
	let personHereString = $state<string>('');
	let personAbsentString = $state<string>('');
	let personIsHereString = $state<string>('');
	let personIsAbsentString = $state<string>('');
	$effect(() => {
		if (!currentPerson) return;
		personQuestion = transformStringWithPerson(pQuestion, currentPerson);
		personHereString = transformStringWithPerson(pHereString, currentPerson);
		personAbsentString = transformStringWithPerson(pAbsentString, currentPerson);
		personIsHereString = transformStringWithPerson(pIsHereString, currentPerson);
		personIsAbsentString = transformStringWithPerson(pIsAbsentString, currentPerson);
	});
</script>

<!-- Welcome Message -->
{#if !currentPerson}
	<div
		class="top-5/12 translate-[-50%] absolute left-[50%] z-20 flex w-5/6 flex-col items-center overflow-ellipsis text-pretty text-center"
	>
		<h2 class="">
			{title}
		</h2>
		<Underline class="mb-10 w-4/6" />
		<h5>
			{subtitle}
		</h5>
		<p class="">{paragraph}</p>
	</div>
{:else}
	<h4 class="absolute top-[2%] w-full text-wrap text-center">
		{#if !currentAttendance}
			{personQuestion}
		{:else}
			{currentAttendance === 'here' ? personIsHereString : personIsAbsentString}
		{/if}
	</h4>
	{#if !currentAttendance}
		<button
			onclick={() => updateAttendance('here')}
			class=" btn preset-filled-success-500 z-26 rounded-4xl absolute bottom-[300px] left-[1%] h-[500px] w-[500px] border-8 hover:scale-105 active:scale-95"
		>
			<div
				class="absolute left-[-5%] right-[-5%] top-0 flex h-20 translate-y-[-70%] items-center justify-center overflow-hidden"
			>
				{#each currentHereVotes.slice(0, 7) as person}
					<img
						src={person.avatarUrl}
						alt={person.name}
						class="aspect-auto h-full w-auto select-none"
					/>
				{/each}
			</div>
			{#if currentHereVotes.length > 7}
				<span
					class="preset-filled-primary-500 translate-[50%] absolute bottom-full right-0 rounded-full border-4 p-2 text-5xl font-bold text-black"
				>
					+{currentHereVotes.length - 7}
				</span>
			{/if}
			<h5 class="z-10 w-full select-none overflow-hidden text-wrap text-center">
				{personHereString}
			</h5>
		</button>
		<button
			onclick={() => updateAttendance('absent')}
			class="btn preset-filled-error-500 z-26 rounded-4xl absolute bottom-[300px] right-[1%] h-[500px] w-[500px] border-8 hover:scale-105 active:scale-95"
		>
			<div
				class="absolute left-[-5%] right-[-5%] top-0 flex h-20 translate-y-[-70%] items-center justify-center overflow-hidden"
			>
				{#each currentAbsentVotes as person}
					<img
						src={person.avatarUrl}
						alt={person.name}
						class="aspect-auto h-full w-auto select-none"
					/>
				{/each}
			</div>
			{#if currentAbsentVotes.length > 7}
				<span
					class="preset-filled-primary-500 translate-[50%] absolute bottom-full right-0 rounded-full border-4 p-2 text-5xl font-bold text-black"
				>
					+{currentAbsentVotes.length - 7}
				</span>
			{/if}
			<h5 class="z-10 w-full select-none overflow-hidden text-wrap text-center">
				{personAbsentString}
			</h5>
		</button>
	{:else}
		<button
			onclick={() => updateAttendance('')}
			class="btn preset-filled-secondary-500 absolute left-[5px] top-[50px] z-30 aspect-square h-[100px] w-[100px] rounded-full border-8 hover:scale-105 active:scale-95"
		>
			<UndoIcon size="50" />
		</button>
	{/if}
	{#if currentAttendance !== 'here'}
		<img
			class="translate-[-50%] absolute left-[50%] top-[48%] z-20 h-[55%]"
			src={currentPerson.avatarUrl || ''}
			alt={currentPerson.name || 'Current Person Avatar'}
		/>
	{:else}
		<iframe
			title={`Video for ${currentPerson?.name}`}
			class="translate-[-50%] rounded-4xl absolute left-[50%] top-[45%] z-20 aspect-video h-[55%]"
			src={youtubeUrl(currentPerson)}
			frameborder="0"
			allowfullscreen
		>
		</iframe>
	{/if}
{/if}

<!-- People Bar -->
<div
	class="translate-[-50%] absolute left-[50%] top-[920px] z-10 m-0 flex h-64 w-[1525px] flex-col justify-evenly p-0 contain-strict"
>
	{#each peopleRows as peopleRow}
		<div class="m-0 flex flex-row justify-evenly p-0">
			{#each peopleRow as person}
				<PersonButton
					{person}
					buttonPreset={hereIds.includes(person.id)
						? 'success'
						: absentIds.includes(person.id)
							? 'error'
							: 'surface'}
					onclick={() => updateCurrentPerson(person)}
					class="aspect-square {pHeight} {person.id == currentPerson?.id
						? 'border-12'
						: hereIds.includes(person.id) || absentIds.includes(person.id)
							? 'border-6'
							: 'border-3'} m-0 p-0"
					showName={false}
				/>
			{/each}
		</div>
	{/each}
</div>

<!-- Decorations -->
<Creature class="absolute bottom-[300px] left-[25px] z-0 h-[275px] " />
<Creature class="absolute bottom-[310px] right-[10px] z-0 h-[275px] " type="shark" />
<Squiggle class="absolute right-[20px] top-[25px] z-0 h-[120px] " type="w" />
<Squiggle class="absolute bottom-[40px] left-[20px] z-0 h-[90px] " />
