<script lang="ts">
	import { onMount } from 'svelte';
	import type { StudentInteractComponentProps } from '$lib/slides';
	import type { PersonActivityData } from './types';
	import type { Person } from '$lib/pb';
	import { transformStringWithPerson } from '$lib';

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
	}: StudentInteractComponentProps = $props();

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

	let { hereVotes = [], absentVotes = [] } = $derived(studentActivity?.data || {});

	let people = $state<Person[]>([]);
	let peopleRows = $state<Person[][]>([]);
	let currentPerson: Person | undefined = $derived(
		people.find((person) => person.id === currentPersonId)
	);
	let currentAttendance: 'here' | 'absent' | '' = $derived(
		hereIds.includes(currentPerson?.id)
			? 'here'
			: absentIds.includes(currentPerson?.id)
				? 'absent'
				: ''
	);

	let currentVote: 'here' | 'absent' | '' = $derived(
		hereVotes.includes(currentPersonId)
			? 'here'
			: absentVotes.includes(currentPersonId)
				? 'absent'
				: ''
	);

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

	const updateVote = async (status: 'here' | 'absent' | '') => {
		if (!currentPerson) return;
		const newData: Partial<PersonActivityData> = {};
		const oldStatus = currentAttendance;
		newData.hereVotes = [...hereVotes].filter((id) => id !== currentPerson.id);
		newData.absentVotes = [...absentVotes].filter((id) => id !== currentPerson.id);
		if (status && status !== oldStatus) {
			(newData[`${status}Votes`] || []).push(currentPerson.id);
		}
		await studentActivity?.updateData(newData);
	};

	type PersonVideo = { id?: string; start?: number; end?: number };
	const getPersonVideo = (person: Person): PersonVideo | undefined => {
		const configVideo = (person.config as { video?: PersonVideo } | undefined)?.video;
		const dataVideo = (person.data as { video?: PersonVideo } | undefined)?.video;
		return configVideo ?? dataVideo;
	};

	const youtubeUrl = (person: Person, embedded: boolean = true) => {
		const video = getPersonVideo(person);
		const videoId = video?.id;
		if (!videoId) return '';
		const start = video?.start ? `&start=${video.start}` : '';
		const end = video?.end ? `&end=${video.end}` : '';
		const baseUrl = embedded
			? 'https://www.youtube.com/embed/'
			: 'https://www.youtube.com/watch?v=';
		const url = `${baseUrl}${videoId}?rel=0&enablejsapi=1&autoplay=0${start}${end}`;
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
	const baseBtnClass = (vote: 'here' | 'absent') => {
		let baseClass =
			'btn z-26 rounded-4xl absolute top-[60%] translate-y-[-50%] hover:scale-105 active:scale-95';
		// determine width and height based on vote
		let dimensions = !currentVote
			? 'w-[800px] h-[800px]'
			: currentVote === vote
				? 'w-[900px] h-[900px]'
				: 'w-[700px] h-[700px]';
		let opacity = currentVote && currentVote !== vote ? 'grayscale-75' : 'opacgrayscaleity-0';
		let borderClass = currentVote === vote ? 'border-48' : 'border-16';
		let textClass = currentVote === vote ? 'text-11xl' : 'text-9xl';
		return `${baseClass} ${borderClass} ${textClass} ${dimensions} ${opacity}`;
	};
	// `btn z-26 rounded-4xl absolute h-[900px] w-[900px] bottom-[100px] hover:scale-105 active:scale-95 ${vote === 'here' ? 'preset-filled-success-500' : 'preset-filled-error-500'}`;
</script>

{#if !currentAttendance}
	{#if currentPerson}
		<h5 class="absolute top-[2%] w-full text-wrap text-center">
			{#if !currentVote}
				What do you think?
			{:else if currentVote === 'here'}
				You think {currentPerson.name} is here!
			{:else}
				You think {currentPerson.name} is not here.
			{/if}
		</h5>
		<button
			onclick={() => updateVote('here')}
			class={` preset-filled-success-500  left-[25%] translate-x-[-50%] ${currentVote === 'here' ? 'border-48' : 'border-16'} ${baseBtnClass('here')}`}
		>
			<span class="w-full select-none overflow-hidden text-wrap text-center">
				{personHereString}
			</span>
		</button>
		<button
			onclick={() => updateVote('absent')}
			class={`preset-filled-error-500 right-[25%] translate-x-[50%] ${currentVote === 'absent' ? 'border-48' : 'border-16'} ${baseBtnClass('absent')}`}
		>
			<span class="w-full select-none overflow-hidden text-wrap text-center">
				{personAbsentString}
			</span>
		</button>
	{/if}
{:else if currentVote === 'here'}
	<h1 class="absolute top-[50%] w-full translate-y-[-50%] text-wrap text-center">
		{personIsHereString}
	</h1>
{:else if currentVote === 'absent'}
	<h1 class="absolute top-[50%] w-full translate-y-[-50%] text-wrap text-center">
		{personIsAbsentString}
	</h1>
{/if}

<!-- Welcome Message -->
<!-- {#if !currentPerson}
	<div
		class="top-5/12 translate-[-50%] absolute left-[50%] z-20 flex w-5/6 flex-col items-center text-pretty border text-center"
	>
		<h2 class="">
			{welcomeTitle}
		</h2>
		<Underline class="mb-10 w-4/6" />
		<h5>
			{welcomeSubtitle}
		</h5>
		<p class="">{welcomeParagraph}</p>
	</div>
{:else}
	<h4 class="absolute top-[2%] w-full text-wrap text-center">
		{#if !currentAttendance}
			{questionText}
		{:else}
			{currentAttendance === 'here' ? hereAnswerText : absentAnswerText}
		{/if}
	</h4>
	{#if currentAttendance !== 'here'}
		<img
			class="translate-[-50%] absolute left-[50%] top-[48%] z-20 h-[55%]"
			src={currentPerson.avatarPath || ''}
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
{/if} -->

<!-- People Bar -->
<!-- <div
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
						? 'outline-6'
						: 'border-2'} m-0 p-0"
					showName={false}
				/>
			{/each}
		</div>
	{/each}
</div> -->

<!-- Decorations -->
<!-- <Creature class="absolute bottom-[300px] left-[25px] z-0 h-[275px] " />
<Creature class="absolute bottom-[310px] right-[10px] z-0 h-[275px] " type="shark" />
<Squiggle class="absolute right-[20px] top-[25px] z-0 h-[120px] " type="w" />
<Squiggle class="absolute bottom-[40px] left-[20px] z-0 h-[90px] " /> -->
