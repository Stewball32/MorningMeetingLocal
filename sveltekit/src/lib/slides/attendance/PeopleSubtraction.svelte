<script lang="ts">
	import { onMount } from 'svelte';
	import type { Student, Teacher } from '$lib/pb/types';
	import PersonButton from '$lib/buttons/PersonButton.svelte';
	import { Popover } from '@skeletonlabs/skeleton-svelte';

	// import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Cross from '@lucide/svelte/icons/x';
	import type { ClassProps, MathClassProps } from './_types';

	interface PeopleMathProps {
		from?: 'left' | 'right';
		peopleTogetherName?: string;
		peopleSubtracted: Student[] | Teacher[];
		peopleSubtractedName?: string;
		peopleRemaining: Student[] | Teacher[];
		peopleRemainingName?: string;
		mathProps?: MathClassProps;
		mathPropsName: 'studentMath' | 'peopleMath';
		title?: string;
		subtitle?: string;
		pageLeft?: () => void;
		pageRight?: () => void;
		updateClassDailySlide: (
			column: string,
			partialClassDaily: Partial<ClassProps>
		) => Promise<void>;
	}

	let {
		peopleTogetherName,
		peopleSubtracted,
		peopleSubtractedName,
		peopleRemaining,
		peopleRemainingName,
		mathProps,
		mathPropsName,
		title,
		subtitle,
		pageLeft = () => {},
		pageRight = () => {},
		updateClassDailySlide = async (column: string, partialClassDaily: Partial<ClassProps>) => {}
	}: PeopleMathProps = $props();

	let peopleTogether: (Student | Teacher)[] = [...peopleSubtracted, ...peopleRemaining].sort(
		(a, b) => a.name.localeCompare(b.name)
	);

	const totalAnswers: number = 4;

	const getStartNumber = (correctNumber: number) => {
		const startNumber =
			Math.floor(Math.random() * totalAnswers) + (correctNumber - totalAnswers + 1);
		return startNumber < 0 ? 0 : startNumber;
	};

	const oneStart = getStartNumber(peopleTogether.length);
	const oneAnswerOptions: number[] = Array.from({ length: totalAnswers }, (_, i) => oneStart + i);

	const twoStart = getStartNumber(peopleSubtracted.length);
	const twoAnswerOptions: number[] = Array.from({ length: totalAnswers }, (_, i) => twoStart + i);

	const resultStart = getStartNumber(peopleRemaining.length);
	const resultAnswerOptions: number[] = Array.from(
		{ length: totalAnswers },
		(_, i) => resultStart + i
	);

	let oneGuesses: number[] = $state(mathProps?.oneGuesses ?? []);
	let twoGuesses: number[] = $state(mathProps?.twoGuesses ?? []);
	let resultGuesses: number[] = $state(mathProps?.resultGuesses ?? []);
	let oneGuess: number | undefined = $derived(oneGuesses[0] ?? undefined);
	let twoGuess: number | undefined = $derived(twoGuesses[0] ?? undefined);
	let resultGuess: number | undefined = $derived(resultGuesses[0] ?? undefined);

	let openStateOne = $state(false);
	function popoverOneClose() {
		openStateOne = false;
	}
	let openStateTwo = $state(false);
	function popoverTwoClose() {
		openStateTwo = false;
	}
	let openStateResult = $state(false);
	function popoverResultClose() {
		openStateResult = false;
	}

	onMount(() => {});

	const baseAnswerClass =
		'btn text-size-8 font-black border-3 md:border-6 rounded-2xl aspect-square';
	const undefinedAnswerClass = `preset-filled-surface-300-700 ${baseAnswerClass}`;
	const correctAnswerClass = `preset-filled-success-300-700 ${baseAnswerClass}`;
	const wrongAnswerClass = `preset-filled-error-300-700 ${baseAnswerClass}`;
	const correctAnswers = {
		one: peopleTogether.length,
		two: peopleSubtracted.length,
		result: peopleRemaining.length
	};
	const isCorrectAnswer = (result: 'one' | 'two' | 'result', num: number) => {
		return correctAnswers[result] === num;
	};
	const getAnswerClass = (answer: 'one' | 'two' | 'result', num?: number) => {
		const answerClass = ' w-[50%]';
		if (num === undefined) return undefinedAnswerClass + answerClass;
		return (isCorrectAnswer(answer, num) ? correctAnswerClass : wrongAnswerClass) + answerClass;
	};
	const wasGuessed = (result: 'one' | 'two' | 'result', num: number) => {
		if (result === 'one') {
			return oneGuesses.includes(num);
		} else if (result === 'two') {
			return twoGuesses.includes(num);
		} else if (result === 'result') {
			return resultGuesses.includes(num);
		}
	};
	const getOptionClass = (result: 'one' | 'two' | 'result', num: number) => {
		if (wasGuessed(result, num)) {
			return isCorrectAnswer(result, num) ? correctAnswerClass : wrongAnswerClass;
		}
		return undefinedAnswerClass;
	};

	const disableGuess = (result: 'one' | 'two' | 'result', num: number) => {
		if (correctAnswers[result] === num) return false;
		const allGuesses = {
			one: oneGuesses,
			two: twoGuesses,
			result: resultGuesses
		};
		const allNums = {
			one: oneGuess,
			two: twoGuess,
			result: resultGuess
		};
		const guesses = allGuesses[result];
		const correctAnswer = correctAnswers[result];
		const currentNum = allNums[result];
		if (correctAnswer === currentNum) {
			return num !== correctAnswer;
		} else {
			return guesses.includes(num);
		}
	};

	const baseGridDivClass = 'grid';
	const getGridDivClass = (columns: number) => {
		const cols: string = 1 <= columns && columns <= 5 ? columns.toString() : '5';
		const gridColClasses = {
			1: 'grid-cols-1 w-1/5',
			2: 'grid-cols-2 w-2/5',
			3: 'grid-cols-3 w-3/5',
			4: 'grid-cols-4 w-4/5',
			5: 'grid-cols-5 w-full'
		};
		const colClass =
			// just making typescript happy
			gridColClasses[cols as unknown as keyof typeof gridColClasses] || gridColClasses[4];
		return `${baseGridDivClass} ${colClass}`;
	};

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			if (
				[resultGuess === undefined, twoGuess === undefined, resultGuess === undefined].every(
					(e) => e
				)
			)
				return pageLeft();
			else if (resultGuess === correctAnswers.result) resultGuess = undefined;
			else if (twoGuess === correctAnswers.two) twoGuess = undefined;
			else if (oneGuess === correctAnswers.one) oneGuess = undefined;
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			if (
				[
					resultGuess === correctAnswers.one,
					twoGuess === correctAnswers.two,
					resultGuess === correctAnswers.result
				].every((e) => e)
			)
				return pageRight();
			else if (oneGuess !== correctAnswers.one) oneGuess = correctAnswers.one;
			else if (twoGuess !== correctAnswers.two) twoGuess = correctAnswers.two;
			else if (resultGuess !== correctAnswers.result) resultGuess = correctAnswers.result;
		}
	}

	let clickedPeopleIds: string[] = $state([]);
	const personClicked = (id: string) => {
		const newClickedPeopleIds = clickedPeopleIds.filter((clickedId) => clickedId !== id);
		if (newClickedPeopleIds.length === clickedPeopleIds.length) {
			clickedPeopleIds = [...clickedPeopleIds, id];
		} else {
			clickedPeopleIds = newClickedPeopleIds;
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

<div class="h-full w-full">
	<div class="flex h-[20%] w-full cursor-default items-center justify-center">
		<h1 class="text-size-8 font-black">{title}</h1>
	</div>
	<div class="flex h-[40%] items-center justify-center">
		<div class="flex w-1/2 items-center justify-center p-[5%]">
			<div class={getGridDivClass(peopleTogether.length)}>
				{#each peopleTogether as person}
					<div class="relative aspect-square">
						{#if clickedPeopleIds.includes(person.id)}
							<Cross
								class="z-1 pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2"
							/>
						{/if}
						<PersonButton
							{person}
							buttonClass="w-full h-full m-0 p-0"
							showName={false}
							onClick={() => {
								personClicked(person.id);
							}}
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="relative grid h-[38%] grid-cols-3 items-center justify-center">
		<div class="relative flex h-full flex-col items-center justify-between px-[2%] py-[5%]">
			<h1
				class="text-size-4 hidden w-full items-center justify-center truncate text-nowrap px-[10%] text-center font-semibold sm:flex"
			>
				{peopleTogetherName}
			</h1>
			<Popover
				open={openStateOne}
				zIndex={'10'}
				onOpenChange={(e) => (openStateOne = e.open)}
				positioning={{ placement: 'top' }}
				classes={getAnswerClass('one', oneGuess)}
				triggerBase="btn text-size-8 font-black w-full h-full"
				contentBase=" preset-filled-surface-300-700 max-w-[600px] rounded-2xl p-4"
				arrow
				arrowBase="preset-filled-surface-300-700"
			>
				{#snippet trigger()}
					{oneGuess ?? '?'}
				{/snippet}
				{#snippet content()}
					<div class="grid grid-cols-2 gap-2 md:gap-4">
						{#each oneAnswerOptions as answer}
							<button
								class={getOptionClass('one', answer)}
								disabled={disableGuess('one', answer)}
								onclick={() => {
									if (oneGuess === answer) {
										oneGuesses = [];
										oneGuess = undefined;
									} else {
										oneGuesses.push(answer);
										oneGuess = answer;
									}
									popoverOneClose();
								}}
							>
								{answer}
							</button>
						{/each}
					</div>
				{/snippet}
			</Popover>
		</div>
		<div
			class="relative flex h-full flex-col items-center justify-between px-[2%] py-[5%] align-bottom"
		>
			<h1
				class="text-size-4 hidden w-full items-center justify-center truncate text-nowrap px-[10%] text-center font-semibold sm:flex"
			>
				{peopleSubtractedName}
			</h1>
			<Popover
				open={openStateTwo}
				zIndex={'10'}
				onOpenChange={(e) => (openStateTwo = e.open)}
				positioning={{ placement: 'top' }}
				classes={getAnswerClass('two', twoGuess)}
				triggerBase="btn text-size-8 font-black w-full h-full"
				contentBase=" preset-filled-surface-300-700 max-w-[600px] rounded-2xl p-4"
				arrow
				arrowBase="preset-filled-surface-300-700"
			>
				{#snippet trigger()}
					{twoGuess ?? '?'}
				{/snippet}
				{#snippet content()}
					<div class="grid grid-cols-2 gap-2 md:gap-4">
						{#each twoAnswerOptions as answer}
							<button
								class={getOptionClass('two', answer)}
								disabled={disableGuess('two', answer)}
								onclick={() => {
									if (twoGuess === answer) {
										twoGuesses = [];
										twoGuess = undefined;
									} else {
										twoGuesses.push(answer);
										twoGuess = answer;
									}
									popoverTwoClose();
								}}
							>
								{answer}
							</button>
						{/each}
					</div>
				{/snippet}
			</Popover>
		</div>
		<div
			class="relative flex h-full flex-col items-center justify-between px-[2%] py-[5%] align-bottom"
		>
			<h1
				class="text-size-4 hidden w-full items-center justify-center truncate text-nowrap px-[10%] text-center font-semibold sm:flex"
			>
				{peopleRemainingName}
			</h1>

			<Popover
				open={openStateResult}
				zIndex={'10'}
				onOpenChange={(e) => (openStateResult = e.open)}
				positioning={{ placement: 'top' }}
				classes={getAnswerClass('result', resultGuess)}
				triggerBase="btn text-size-8 font-black w-full h-full"
				contentBase=" preset-filled-surface-300-700 max-w-[600px] rounded-2xl p-4"
				arrow
				arrowBase="preset-filled-surface-300-700"
			>
				{#snippet trigger()}
					{resultGuess ?? '?'}
				{/snippet}
				{#snippet content()}
					<div class="grid grid-cols-2 gap-2 md:gap-4">
						{#each resultAnswerOptions as answer}
							<button
								class={getOptionClass('result', answer)}
								disabled={disableGuess('result', answer)}
								onclick={() => {
									if (resultGuess === answer) {
										resultGuesses = [];
										resultGuess = undefined;
									} else {
										resultGuesses.push(answer);
										resultGuess = answer;
									}
									popoverResultClose();
								}}
							>
								{answer}
							</button>
						{/each}
					</div>
				{/snippet}
			</Popover>
		</div>

		<h2
			class="-translate-1/2 text-size-8 absolute left-1/3 top-[60%] transform items-center text-center font-black"
		>
			-
		</h2>
		<h2
			class="-translate-1/2 text-size-8 absolute left-2/3 top-[60%] transform items-center text-center font-black"
		>
			=
		</h2>
	</div>
</div>
