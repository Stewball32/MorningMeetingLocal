<script lang="ts">
	import { onMount } from 'svelte';
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import PersonButton from '$lib/PersonButton.svelte';
  import { Popover } from '@skeletonlabs/skeleton-svelte';
  import IconX from '@lucide/svelte/icons/x';

  

	interface PeopleMathProps {
		peopleOne: Student[] | Teacher[];
		peopleOneMap?: Map<string, StudentDaily | TeacherDaily>;
		peopleOneName?: string;
		peopleTwo: Student[] | Teacher[];
		peopleTwoMap?: Map<string, StudentDaily | TeacherDaily>;
		peopleTwoName?: string;
		mathOperation: 'add' | 'subtract';
		resultMap?: Map<string, StudentDaily | TeacherDaily>;
		resultName?: string;
		title?: string;
		subtitle?: string;
		pageLeft?: () => void;
		pageRight?: () => void;
	}

	let {
		peopleOne,
		peopleOneMap,
		peopleOneName,
		peopleTwo,
		peopleTwoMap,
		peopleTwoName,
		mathOperation,
		resultName,
		title,
		subtitle,
		pageLeft = () => {},
		pageRight = () => {}
	}: PeopleMathProps = $props();

	let peopleAnswer: Student[] | Teacher[] = $derived(
		mathOperation === 'add'
			? peopleOne.filter((p1) => !peopleTwo.some((p2) => p2.id === p1.id)).concat(peopleTwo)
			: mathOperation === 'subtract'
				? peopleOne.filter((p1) => !peopleTwo.some((p2) => p2.id === p1.id))
				: peopleOne
	);

	let openStateOne = $state(false);

  function popoverOneClose() {
    openStateOne = false;
  }

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			pageLeft();
		} else if (event.key === 'ArrowRight') {
			pageRight();
		}
	}
</script>

<svelte:window on:keydown|preventDefault={onKeydown} />

<div class="h-full w-full bg-green-500">
	<div class="flex h-[20%] w-full items-center justify-center bg-red-500">
		<h1 class="text-title">{title}</h1>
	</div>
	<div class="grid h-[42%] w-full grid-cols-3 items-center bg-amber-500">
		<div
			class={'grid w-full grid-cols-5 justify-center bg-blue-300 p-[5%]' +
				(peopleOne.length < 5 ? ' items-center' : '')}
		>
			<!-- Square Items -->
			{#each peopleOne as personOne}
				<div class="relative aspect-square w-full">
					<PersonButton
						person={personOne}
						showName={false}
						style="w-full h-full"
						daily={peopleOneMap?.get(personOne.id)}
					/>
				</div>
			{/each}
		</div>
		<div
			class={'grid w-full grid-cols-5 justify-center bg-blue-400 p-[5%]' +
				(peopleTwo.length < 5 ? ' items-center' : '')}
		>
			{#each peopleTwo as personTwo}
				<div class="relative aspect-square w-full">
					<PersonButton
						person={personTwo}
						showName={false}
						style="w-full h-full"
						daily={peopleTwoMap?.get(personTwo.id)}
					/>
				</div>
			{/each}
		</div>
		<div class="grid w-full grid-cols-5 justify-center bg-blue-500 p-[5%]">
			{#each peopleAnswer as personAnswer}
				<div class="relative aspect-square w-full">
					<PersonButton person={personAnswer} showName={false} style="w-full h-full" />
				</div>
			{/each}
		</div>
	</div>
	<div class="relative grid h-[38%] grid-cols-3 items-center justify-center bg-purple-500">
		<div class="relative flex h-full flex-col items-center justify-between p-[5%] align-bottom">
			<Popover
			open={openStateOne}
			onOpenChange={(e) => (openStateOne = e.open)}
			positioning={{ placement: 'top' }}
			triggerBase="btn text-question preset-outlined outline-4 w-[45%] aspect-square "
			contentBase="preset-filled-surface-500 max-w-[300px] rounded-2xl p-4"
			arrow
		>
			{#snippet trigger()}?{/snippet}
			{#snippet content()}
				<article>
					<p class="opacity-60 ">
						This will display a basic popover with a header and body. This also includes a title,
						description, and close button.
					</p>
				</article>
			{/snippet}
		</Popover>
			<h1 class="text-answer px-[10%] text-center">{peopleOneName}</h1>

			<!-- <button class="btn  text-question preset-outlined outline-4 w-[45%] aspect-square "> ? </button> -->
		</div>
		<div class="relative flex h-full flex-col items-center justify-between p-[5%] align-bottom">
			<h1 class="text-answer justify-center px-[10%] text-center align-middle">{peopleTwoName}</h1>
			<button class="btn text-question preset-outlined aspect-square w-[45%] outline-4"> ? </button>
		</div>
		<div class="relative flex h-full flex-col items-center justify-between p-[5%] align-bottom">
			<h1 class="text-answer px-[10%] text-center">{resultName}</h1>
			<button class="btn text-question preset-outlined aspect-square w-[45%] outline-4"> ? </button>
		</div>

		<h2
			class="-translate-1/2 text-title absolute left-1/3 top-[60%] transform items-center text-center"
		>
			{mathOperation === 'add' ? '+' : mathOperation === 'subtract' ? '-' : ''}
		</h2>
		<h2
			class="-translate-1/2 text-title absolute left-2/3 top-[60%] transform items-center text-center"
		>
			=
		</h2>
	</div>
</div>
