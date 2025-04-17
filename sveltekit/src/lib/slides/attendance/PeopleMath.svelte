<script lang="ts">
	import { onMount } from 'svelte';
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import PersonButton from '$lib/PersonButton.svelte';
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import IconX from '@lucide/svelte/icons/x';

	interface PeopleMathProps {
		from?: 'left' | 'right';
		peopleOne: Student[] | Teacher[];
		peopleOneMap?: Map<string, StudentDaily | TeacherDaily>;
		peopleOneName?: string;
		peopleOneGuess?: number;
		peopleTwo: Student[] | Teacher[];
		peopleTwoMap?: Map<string, StudentDaily | TeacherDaily>;
		peopleTwoName?: string;
		peopleTwoGuess?: number;
		mathOperation: 'add' | 'subtract';
		resultMap?: Map<string, StudentDaily | TeacherDaily>;
		resultName?: string;
		resultGuess?: number;
		showHint?: boolean;
		title?: string;
		subtitle?: string;
		pageLeft?: () => void;
		pageRight?: () => void;
		setNavUrl: (
			params: Record<string, string | number | (string | number)[] | null | undefined>
		) => void;
	}

	let {
		peopleOne,
		peopleOneMap,
		peopleOneName,
		peopleOneGuess = $bindable(undefined),
		peopleTwo,
		peopleTwoMap,
		peopleTwoName,
		peopleTwoGuess = $bindable(undefined),
		mathOperation,
		resultMap,
		resultName,
		resultGuess: peopleResultGuess = $bindable(undefined),
		showHint = $bindable(false),
		title,
		subtitle,
		pageLeft = () => {},
		pageRight = () => {},
		setNavUrl
	}: PeopleMathProps = $props();

	const peopleResult: Student[] | Teacher[] =
		mathOperation === 'add'
			? peopleOne.filter((p1) => !peopleTwo.some((p2) => p2.id === p1.id)).concat(peopleTwo)
			: mathOperation === 'subtract'
				? peopleOne.filter((p1) => !peopleTwo.some((p2) => p2.id === p1.id))
				: peopleOne;

	const totalAnswers: number = 6;

	const getStartNumber = (correctNumber: number) => {
		const startNumber =
			Math.floor(Math.random() * totalAnswers) + (correctNumber - totalAnswers + 1);
		return startNumber < 0 ? 0 : startNumber;
	};

	const oneStart = getStartNumber(peopleOne.length);
	const oneAnswerOptions: number[] = Array.from({ length: totalAnswers }, (_, i) => oneStart + i);

	const twoStart = getStartNumber(peopleTwo.length);
	const twoAnswerOptions: number[] = Array.from({ length: totalAnswers }, (_, i) => twoStart + i);

	const resultStart = getStartNumber(peopleResult.length);
	const resultAnswerOptions: number[] = Array.from(
		{ length: totalAnswers },
		(_, i) => resultStart + i
	);

	let peopleOneGuesses: number[] = $state([]);
	let peopleTwoGuesses: number[] = $state([]);
	let peopleResultGuesses: number[] = $state([]);

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

	onMount(() => {
		setNavUrl({
			num1: peopleOneGuess === correctAnswers.one ? 1 : undefined,
			num2: peopleTwoGuess === correctAnswers.two ? 1 : undefined,
			answer: peopleResultGuess === correctAnswers.result ? 1 : undefined,
			hint: showHint ? 1 : undefined
		});
	});

	const baseAnswerClass = 'btn text-title border-3 md:border-6 rounded-2xl aspect-square';
	const undefinedAnswerClass = `preset-filled-surface-300-700 ${baseAnswerClass}`;
	const correctAnswerClass = `preset-filled-success-300-700 ${baseAnswerClass}`;
	const wrongAnswerClass = `preset-filled-error-300-700 ${baseAnswerClass}`;
	const correctAnswers = {
		one: peopleOne.length,
		two: peopleTwo.length,
		result: peopleResult.length
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
			return peopleOneGuesses.includes(num);
		} else if (result === 'two') {
			return peopleTwoGuesses.includes(num);
		} else if (result === 'result') {
			return peopleResultGuesses.includes(num);
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
			one: peopleOneGuesses,
			two: peopleTwoGuesses,
			result: peopleResultGuesses
		};
		const allNums = {
			one: peopleOneGuess,
			two: peopleTwoGuess,
			result: peopleResultGuess
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
		const cols: string = 1 <= columns && columns <= 4 ? columns.toString() : '4';
		const gridColClasses = {
			1: 'grid-cols-1 w-1/4',
			2: 'grid-cols-2 w-2/4',
			3: 'grid-cols-3 w-3/4',
			4: 'grid-cols-4 w-full'
		};
		// just making typescript happy
		const colClass =
			gridColClasses[cols as unknown as keyof typeof gridColClasses] || gridColClasses[4];
		return `${baseGridDivClass} ${colClass}`;
	};

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			if (
				[
					peopleResultGuess === undefined,
					peopleTwoGuess === undefined,
					peopleResultGuess === undefined
				].every((e) => e)
			)
				return pageLeft();
			else if (peopleResultGuess === correctAnswers.result) peopleResultGuess = undefined;
			else if (peopleTwoGuess === correctAnswers.two) peopleTwoGuess = undefined;
			else if (peopleOneGuess === correctAnswers.one) peopleOneGuess = undefined;
			setNavUrl({
				num1: correctAnswers.one === peopleOneGuess ? 1 : undefined,
				num2: correctAnswers.two === peopleOneGuess ? 1 : undefined,
				answer: correctAnswers.result === peopleOneGuess ? 1 : undefined,
				hint: showHint ? 1 : undefined
			});
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			if (
				[
					peopleResultGuess === correctAnswers.one,
					peopleTwoGuess === correctAnswers.two,
					peopleResultGuess === correctAnswers.result
				].every((e) => e)
			)
				return pageRight();
			else if (peopleOneGuess !== correctAnswers.one) peopleOneGuess = correctAnswers.one;
			else if (peopleTwoGuess !== correctAnswers.two) peopleTwoGuess = correctAnswers.two;
			else if (peopleResultGuess !== correctAnswers.result) peopleResultGuess = correctAnswers.result;
			setNavUrl({
				num1: correctAnswers.one === peopleOneGuess ? 1 : undefined,
				num2: correctAnswers.two === peopleTwoGuess ? 1 : undefined,
				answer: correctAnswers.result === peopleResultGuess ? 1 : undefined,
				hint: showHint ? 1 : undefined
			});
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

<svelte:window on:keydown|preventDefault={onKeydown} />

<div class="h-full w-full">
	<div class="flex h-[20%] w-full items-center justify-center">
		<h1 class="text-title">{title}</h1>
	</div>
	<div class="grid h-[40%] grid-cols-3 items-center justify-center">
		<div class="flex w-full items-center justify-center p-[5%]">
			<div class={getGridDivClass(peopleOne.length)}>
				{#each peopleOne as personOne}
					<div class="aspect-square">
						<PersonButton
							onClick={() => {
								personClicked(personOne.id);
							}}
							person={personOne}
							showName={false}
							style={"w-full h-full"}
							forceStyle={clickedPeopleIds.includes(personOne.id) && mathOperation === "subtract" ? 'absent' : undefined}
							daily={peopleOneMap?.get(personOne.id)}
						/>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex w-full items-center justify-center p-[5%]">
			<div class={getGridDivClass(peopleTwo.length)}>
				{#each peopleTwo as personTwo}
					<div class="aspect-square">
						<PersonButton
							person={personTwo}
							showName={false}
							style="w-full h-full"
							daily={peopleTwoMap?.get(personTwo.id)}
						/>
					</div>
				{/each}
			</div>
		</div>

		<div class="flex w-full items-center justify-center p-[5%]">
			{#if showHint || peopleResultGuess === correctAnswers.result}
				<div class={getGridDivClass(peopleResult.length)}>
					{#each peopleResult as personResult}
						<div class="aspect-square">
							<PersonButton
								person={personResult}
								showName={false}
								style="w-full h-full"
								daily={resultMap?.get(personResult.id)}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<button
					onclick={() => {
						showHint = true;
					}}
					class="btn text-title preset-outlined w-full rounded-full"
				>
					???
				</button>
			{/if}
		</div>
	</div>
	<div class="relative grid h-[38%] grid-cols-3 items-center justify-center">
		<div
			class="relative flex h-full flex-col items-center justify-between px-[2%] py-[5%] align-bottom"
		>
			<h1 class="text-answer hidden w-full truncate text-nowrap px-[10%] text-center sm:block">
				{peopleOneName}
			</h1>
			<Popover
				open={openStateOne}
				onOpenChange={(e) => (openStateOne = e.open)}
				positioning={{ placement: 'top' }}
				classes={getAnswerClass('one', peopleOneGuess)}
				triggerBase="btn text-title w-full h-full"
				contentBase="preset-filled-surface-300-700 max-w-[600px] rounded-2xl p-4"
				arrow
				arrowBase="preset-filled-surface-300-700"
			>
				{#snippet trigger()}
					{peopleOneGuess ?? '?'}
				{/snippet}
				{#snippet content()}
					<div class="grid grid-cols-3 gap-2 md:gap-4">
						{#each oneAnswerOptions as answer}
							<button
								class={getOptionClass('one', answer)}
								disabled={disableGuess('one', answer)}
								onclick={() => {
									if (peopleOneGuess === answer) {
										peopleOneGuesses = [];
										peopleOneGuess = undefined;
									} else {
										peopleOneGuesses.push(answer);
										peopleOneGuess = answer;
									}
									setNavUrl({
										num1: correctAnswers.one === peopleOneGuess ? 1 : undefined,
										num2: correctAnswers.two === peopleTwoGuess ? 1 : undefined,
										answer: correctAnswers.result === peopleResultGuess ? 1 : undefined,
										hint: showHint ? 1 : undefined
									});
									popoverOneClose();
								}}
							>
								{answer}
							</button>
						{/each}
					</div>
				{/snippet}
			</Popover>

			<!-- <button class="btn  text-question preset-outlined outline-4 w-[45%] aspect-square "> ? </button> -->
		</div>
		<div
			class="relative flex h-full flex-col items-center justify-between px-[2%] py-[5%] align-bottom"
		>
			<h1 class="text-answer hidden w-full truncate text-nowrap px-[10%] text-center sm:block">
				{peopleTwoName}
			</h1>
			<Popover
				open={openStateTwo}
				onOpenChange={(e) => (openStateTwo = e.open)}
				positioning={{ placement: 'top' }}
				classes={getAnswerClass('two', peopleTwoGuess)}
				triggerBase="btn text-title w-full h-full"
				contentBase="preset-filled-surface-300-700 max-w-[600px] rounded-2xl p-4"
				arrow
				arrowBase="preset-filled-surface-300-700"
			>
				{#snippet trigger()}
					{peopleTwoGuess ?? '?'}
				{/snippet}
				{#snippet content()}
					<div class="grid grid-cols-3 gap-2 md:gap-4">
						{#each twoAnswerOptions as answer}
							<button
								class={getOptionClass('two', answer)}
								disabled={disableGuess('two', answer)}
								onclick={() => {
									if (peopleTwoGuess === answer) {
										peopleTwoGuesses = [];
										peopleTwoGuess = undefined;
									} else {
										peopleTwoGuesses.push(answer);
										peopleTwoGuess = answer;
									}
									setNavUrl({
										num1: correctAnswers.one === peopleOneGuess ? 1 : undefined,
										num2: correctAnswers.two === peopleTwoGuess ? 1 : undefined,
										answer: correctAnswers.result === peopleResultGuess ? 1 : undefined,
										hint: showHint ? 1 : undefined
									});
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
			<h1 class="text-answer hidden w-full truncate text-nowrap px-[10%] text-center sm:block">
				{resultName}
			</h1>

			<Popover
				open={openStateResult}
				onOpenChange={(e) => (openStateResult = e.open)}
				positioning={{ placement: 'top' }}
				classes={getAnswerClass('result', peopleResultGuess)}
				triggerBase="btn text-title w-full h-full"
				contentBase="preset-filled-surface-300-700 max-w-[600px] rounded-2xl p-4"
				arrow
				arrowBase="preset-filled-surface-300-700"
			>
				{#snippet trigger()}
					{peopleResultGuess ?? '?'}
				{/snippet}
				{#snippet content()}
					<div class="grid grid-cols-3 gap-2 md:gap-4">
						{#each resultAnswerOptions as answer}
							<button
								class={getOptionClass('result', answer)}
								disabled={disableGuess('result', answer)}
								onclick={() => {
									if (peopleResultGuess === answer) {
										peopleResultGuesses = [];
										peopleResultGuess = undefined;
									} else {
										peopleResultGuesses.push(answer);
										peopleResultGuess = answer;
									}
									setNavUrl({
										num1: correctAnswers.one === peopleOneGuess ? 1 : undefined,
										num2: correctAnswers.two === peopleTwoGuess ? 1 : undefined,
										answer: correctAnswers.result === peopleResultGuess ? 1 : undefined,
										hint: showHint ? 1 : undefined
									});
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
