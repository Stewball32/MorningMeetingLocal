<script lang="ts">
	import { onMount } from 'svelte';
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import PersonButton from '$lib/PersonButton.svelte';
	import { Popover, Switch } from '@skeletonlabs/skeleton-svelte';

	// import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Hash from '@lucide/svelte/icons/hash';
	import GripHorizontal from '@lucide/svelte/icons/grip-horizontal';
	import type { ClassProps, MathPageProps } from './_types';

	interface PeopleMathProps {
		from?: 'left' | 'right';
		peopleOne: Student[] | Teacher[];
		peopleOneName?: string;
		peopleTwo: Student[] | Teacher[];
		peopleTwoName?: string;
		resultName?: string;
		mathProps?: MathPageProps;
		mathPropsName: 'studentMath' | 'peopleMath';
		title?: string;
		subtitle?: string;
		pageLeft?: () => void;
		pageRight?: () => void;
		updateClassDailyAttendance?: (
			partialClassDailyAttendance: Partial<ClassProps>
		) => Promise<void>;
	}

	let {
		peopleOne,
		peopleOneName: oneName,
		peopleTwo,
		peopleTwoName: twoName,
		resultName,
		mathProps,
		mathPropsName,
		title,
		subtitle,
		pageLeft = () => {},
		pageRight = () => {},
		updateClassDailyAttendance = async (partialClassDailyAttendance: Partial<ClassProps>) => {}
	}: PeopleMathProps = $props();

	const peopleResult: Student[] | Teacher[] = peopleOne.filter((p1) => !peopleTwo.some((p2) => p2.id === p1.id)).concat(peopleTwo);

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

	let oneGuesses: number[] = $state(mathProps?.oneGuesses ?? []);
	let twoGuesses: number[] = $state(mathProps?.twoGuesses ?? []);
	let resultGuesses: number[] = $state(mathProps?.resultGuesses ?? []);
	let oneGuess: number | undefined = $derived(oneGuesses[0] ?? undefined);
	let twoGuess: number | undefined = $derived(twoGuesses[0] ?? undefined);
	let resultGuess: number | undefined = $derived(resultGuesses[0] ?? undefined);
	let showHintOne = $state(mathProps?.showHintOne ?? true);
	let showHintTwo = $state(mathProps?.showHintTwo ?? true);
	let showHintResult = $state(mathProps?.showHintResult ?? false);

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
		// just making typescript happy
		const colClass =
			gridColClasses[cols as unknown as keyof typeof gridColClasses] || gridColClasses[4];
		return `${baseGridDivClass} ${colClass}`;
	};

	const toggleHint = (result: 'one' | 'two' | 'result') => {
		console.log('toggleHint', result);
		if (result === 'one') {
			showHintOne = !showHintOne;
			console.log('showHintOne', showHintOne);
		} else if (result === 'two') {
			showHintTwo = !showHintTwo;
		} else if (result === 'result') {
			showHintResult = !showHintResult;
		}
		const attendanceProps: Partial<ClassProps> = {};
		attendanceProps[mathPropsName] = {
			...mathProps,
			showHintOne,
			showHintTwo,
			showHintResult
		};
		updateClassDailyAttendance(attendanceProps);
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

<svelte:window on:keydown|preventDefault={onKeydown} />

<div class="h-full w-full">
	<div class="flex h-[20%] w-full items-center justify-center">
		<h1 class="text-title">{title}</h1>
	</div>
	<div class="grid h-[40%] grid-cols-3 items-center justify-center">
		<div class="flex w-full items-center justify-center p-[5%]">
			{#if showHintOne}
				<div class={getGridDivClass(peopleOne.length)}>
					{#each peopleOne as personOne}
						<div class="aspect-square">
							<PersonButton
								onClick={() => {
									personClicked(personOne.id);
								}}
								person={personOne}
								showName={false}
								style="w-full h-full m-0 p-0"
								forceStyle={undefined}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex h-full w-full items-center justify-center">
					<h1 class="text-character">
						{#if oneGuess === correctAnswers.one}
							{oneGuess}
						{:else}
							?
						{/if}
					</h1>
				</div>
			{/if}
		</div>
		<div class="flex w-full items-center justify-center p-[5%]">
			{#if showHintTwo}
				<div class={getGridDivClass(peopleTwo.length)}>
					{#each peopleTwo as personTwo}
						<div class="aspect-square">
							<PersonButton
								person={personTwo}
								showName={false}
								style="w-full h-full m-0 p-0"
								forceStyle={undefined}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex h-full w-full items-center justify-center">
					<h1 class="text-character">
						{#if twoGuess === correctAnswers.two}
							{twoGuess}
						{:else}
							?
						{/if}
					</h1>
				</div>
			{/if}
		</div>

		<div class="flex w-full items-center justify-center p-[5%]">
			{#if showHintResult}
				<div class={getGridDivClass(peopleResult.length)}>
					{#each peopleResult as personResult}
						<div class="aspect-square">
							<PersonButton
								person={personResult}
								showName={false}
								style="w-full h-full m-0 p-0"
								forceStyle={undefined}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex h-full w-full items-center justify-center">
					<h1 class="text-character">
						{#if resultGuess === correctAnswers.result}
							{resultGuess}
						{:else}
							?
						{/if}
					</h1>
				</div>
			{/if}
		</div>
	</div>
	<div class="relative grid h-[38%] grid-cols-3 items-center justify-center">
		<div class="relative flex h-full flex-col items-center justify-between px-[2%] py-[5%]">
			<h1
				class="text-answer hidden w-full items-center justify-center truncate text-nowrap px-[10%] text-center sm:flex"
			>
				<Switch
					name="one"
					classes="h-1/2"
					controlWidth=""
					compact
					checked={showHintOne}
					onCheckedChange={() => {
						toggleHint('one');
					}}
				>
					{#snippet inactiveChild()}<Hash size="20" />{/snippet}
					{#snippet activeChild()}<GripHorizontal size="20" />{/snippet}
				</Switch>
				{oneName}
			</h1>
			<Popover
				open={openStateOne}
				onOpenChange={(e) => (openStateOne = e.open)}
				positioning={{ placement: 'top' }}
				classes={getAnswerClass('one', oneGuess)}
				triggerBase="btn text-title w-full h-full"
				contentBase="preset-filled-surface-300-700 max-w-[600px] rounded-2xl p-4"
				arrow
				arrowBase="preset-filled-surface-300-700"
			>
				{#snippet trigger()}
					{oneGuess ?? '?'}
				{/snippet}
				{#snippet content()}
					<div class="grid grid-cols-3 gap-2 md:gap-4">
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

			<!-- <button class="btn  text-question preset-outlined outline-4 w-[45%] aspect-square "> ? </button> -->
		</div>
		<div
			class="relative flex h-full flex-col items-center justify-between px-[2%] py-[5%] align-bottom"
		>
			<h1
				class="text-answer hidden w-full items-center justify-center truncate text-nowrap px-[10%] text-center sm:flex"
			>
				<Switch
					name="one"
					classes="h-1/2"
					controlWidth=""
					compact
					checked={showHintTwo}
					onCheckedChange={() => {
						toggleHint('two');
					}}
				>
					{#snippet inactiveChild()}<Hash size="20" />{/snippet}
					{#snippet activeChild()}<GripHorizontal size="20" />{/snippet}
				</Switch>
				{twoName}
			</h1>
			<Popover
				open={openStateTwo}
				onOpenChange={(e) => (openStateTwo = e.open)}
				positioning={{ placement: 'top' }}
				classes={getAnswerClass('two', twoGuess)}
				triggerBase="btn text-title w-full h-full"
				contentBase="preset-filled-surface-300-700 max-w-[600px] rounded-2xl p-4"
				arrow
				arrowBase="preset-filled-surface-300-700"
			>
				{#snippet trigger()}
					{twoGuess ?? '?'}
				{/snippet}
				{#snippet content()}
					<div class="grid grid-cols-3 gap-2 md:gap-4">
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
				class="text-answer hidden w-full items-center justify-center truncate text-nowrap px-[10%] text-center sm:flex"
			>
				<Switch
					name="one"
					classes="h-1/2"
					controlWidth=""
					compact
					checked={showHintResult}
					onCheckedChange={() => {
						toggleHint('result');
					}}
				>
					{#snippet inactiveChild()}<Hash size="20" />{/snippet}
					{#snippet activeChild()}<GripHorizontal size="20" />{/snippet}
				</Switch>
				{resultName}
			</h1>

			<Popover
				open={openStateResult}
				onOpenChange={(e) => (openStateResult = e.open)}
				positioning={{ placement: 'top' }}
				classes={getAnswerClass('result', resultGuess)}
				triggerBase="btn text-title w-full h-full"
				contentBase="preset-filled-surface-300-700 max-w-[600px] rounded-2xl p-4"
				arrow
				arrowBase="preset-filled-surface-300-700"
			>
				{#snippet trigger()}
					{resultGuess ?? '?'}
				{/snippet}
				{#snippet content()}
					<div class="grid grid-cols-3 gap-2 md:gap-4">
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
			class="-translate-1/2 text-title absolute left-1/3 top-[60%] transform items-center text-center"
		>
		+
		</h2>
		<h2
			class="-translate-1/2 text-title absolute left-2/3 top-[60%] transform items-center text-center"
		>
			=
		</h2>
	</div>
</div>
