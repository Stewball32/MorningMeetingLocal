<script lang="ts">
	import { onMount } from 'svelte';
	// import type { SlideConfig, ClassActivityRecord, PersonActivityRecord } from './types';
	import { transformStringWithPerson } from '$lib';
	import { PresentationActivity, type Guest, type Student, type Teacher } from '$lib/pb/objects';
	import type { StudentInteractComponentPropsWrapper } from './_types';
	import UndoIcon from '@lucide/svelte/icons/undo';
	import Underline from '$lib/slideAssets/decorations/Underline.svelte';
	import PersonButton from '$lib/slideAssets/buttons/PersonButton.svelte';
	import Creature from '$lib/slideAssets/decorations/Creature.svelte';
	import Squiggle from '$lib/slideAssets/decorations/Squiggle.svelte';

	let {
		// classroom,
		// deck,
		// presentation,
		slide,
		students,
		teachers,
		guests,
		classroomActivity
		// studentActivity
	}: StudentInteractComponentPropsWrapper = $props();

	let {
		title = "Let's take Attendance!",
		subtitle = 'Who is here today?',
		paragraph = 'Click on a person below...',
		roster = ['students'],
		pQuestion = 'Is {name} here?',
		pHereString = '{pronoun} is here',
		pAbsentString = '{pronoun} is not here',
		pIsHereString = 'Good Morning, {name}!',
		pIsAbsentString = '{name} is not here.'
	} = $derived(slide.config);

	let { currentPersonId = '', hereIds = [], absentIds = [] } = $derived(classroomActivity.data);

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
		class="top-5/12 translate-[-50%] absolute left-[50%] z-20 flex w-5/6 flex-col items-center text-pretty text-center"
	>
		<h2 class="">
			{title}
		</h2>
		<Underline class="mb-10 w-4/6" />
		<h5>
			{subtitle}
		</h5>
		<!-- <p class="">{paragraph}</p> -->
	</div>
{:else}
	<h3 class="absolute top-[2%] w-full text-wrap text-center">
		{#if !currentAttendance}
			{personQuestion}
		{:else}
			{currentAttendance === 'here' ? personIsHereString : personIsAbsentString}
		{/if}
	</h3>
	<img
		class="absolute bottom-[5%] left-[50%] z-20 h-[75%] translate-x-[-50%]"
		src={currentPerson.avatarUrl || ''}
		alt={currentPerson.name || 'Current Person Avatar'}
	/>
{/if}

<!-- Decorations -->
<Creature class="absolute bottom-[300px] left-[25px] z-0 h-[275px]" type="fish" />
<Creature class="absolute bottom-[310px] right-[10px] z-0 h-[275px]" type="shark" />
<Squiggle class="absolute right-[20px] top-[25px] z-0 h-[120px]" type="w" />
<Squiggle class="absolute bottom-[40px] left-[20px] z-0 h-[90px]" />
