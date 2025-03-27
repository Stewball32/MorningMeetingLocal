<script lang="ts">
	import Paper from '$lib/Paper.svelte'
	import type { Student, Teacher } from '$lib/pb'
	import { Slide, Transition } from '@animotion/core'
	import { slideStyle } from '$lib'
	import { slide } from 'svelte/transition'

	interface Props {
		students?: Student[]
		teachers?: Teacher[]
	}

	let { students = [], teachers = [] }: Props = $props()

	interface IndexedStudent extends Student {
		index: number
	}
	let indexedStudents: IndexedStudent[] = $derived(
		students.map((student, index) => ({ ...student, index: index + 1 }))
	)

	interface IndexedTeacher extends Teacher {
		index: number
	}
	let indexedTeachers: IndexedTeacher[] = $derived(
		teachers.map((teacher, index) => ({ ...teacher, index: index + 1 }))
	)

	let currentStudent: IndexedStudent | undefined = $state(undefined)
	let currentTeacher: IndexedTeacher | undefined = $state(undefined)

	const changeSlide = (student: IndexedStudent) => {
		
	}

	// const slideStyle = ' aspect-[16/9] place-items-center'
</script>

<Slide interactive class="place-items-center">
	<Paper data_id="attendance-paper" />

	<Slide animate class="place-content-center" in={() => currentStudent !== undefined}>
		<div class={slideStyle + 'border-2 border-green-500'}>
			<div class="flex h-[10%] w-full justify-evenly outline-2 2xl:outline-red-500">
				{#each indexedStudents as student}
					{#if student.id !== currentStudent?.id}
						<button
							data-id={'student-button-' + student.id}
							class="btn preset-tonal-surface aspect-video h-full truncate rounded-2xl px-2 text-3xl"
						>
							{student.name}
						</button>
					{/if}
				{/each}
			</div>

			<div class="h-[80%] w-full">
				<div class="flex h-full w-full flex-col items-center justify-center gap-8">
					<h1 class="text-balance text-8xl">Which Students are here today?</h1>
					<h2 class="text-4xl">Click on a student above!</h2>
				</div>
			</div>
			<div class="h-[80%] w-full">
				<div class="flex h-full w-full flex-col items-center justify-center gap-8">
					<h1 class="text-balance text-8xl">Which Students are here today?</h1>
					<h2 class="text-4xl">Click on a student above!</h2>
				</div>
			</div>
		</div>
	</Slide>
	{#each indexedStudents as student}
		<Slide animate class="place-content-center" in={() => currentStudent !== student}>
			<div class={slideStyle + 'border-2 border-green-500'}>
				<div class="flex h-[10%] w-full justify-evenly outline-2 2xl:outline-red-500">
					{#each indexedStudents as student}
						{#if student.id !== currentStudent?.id}
							<button
								data-id={'student-button-' + student.id}
								onclick={() => (currentStudent = student)}
								class="btn preset-tonal-surface aspect-video h-full truncate rounded-2xl px-2 text-3xl"
							>
								{student.name}
							</button>
						{/if}
					{/each}
				</div>
				<div class="h-[50%] w-full">
					<div class="flex h-full w-full items-center justify-center">
						<button
							data-id={'student-button-' + student.id}
							class="btn preset-tonal-surface rounded-4xl aspect-video truncate px-4 text-6xl"
							>{student.name}</button
						>
					</div>
				</div>
			</div>
		</Slide>
	{/each}
	<!-- <Paper data_id="attendance-paper" /> -->
</Slide>

<!-- class="aspect-[16/9] max-h-full max-w-full place-items-center border-2 border-green-500 " -->
