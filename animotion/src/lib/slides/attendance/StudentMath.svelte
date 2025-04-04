<script lang="ts">
	import { onMount } from 'svelte'
	import { slideStyle } from '$lib'
	import NameButton from '$lib/slides/attendance/NameButton.svelte'
	import Paper from '$lib/Paper.svelte'
	import { Slide } from '@animotion/core'
	import type { Student, StudentLog, Teacher, TeacherLog } from '$lib/pb'
	import { currentPerson } from '$lib'

	interface Props {
		students?: Student[]
		studentLogMap?: Map<string, StudentLog>
		paper_id?: string
	}

	let {
		students = [],
		studentLogMap = new Map<string, StudentLog>(),
		paper_id
	}: Props = $props()

	const numStudents = $derived(
		students.filter((student) => studentLogMap.get(student.id)?.here).length
	)
	const numStudentsAbsent = $derived(
		students.filter((student) => studentLogMap.get(student.id)?.here === 'absent').length
	)
	const numStudentsPresent = $derived(
		students.filter((student) => studentLogMap.get(student.id)?.here === 'present').length
	)
</script>

<Slide class="place-items-center">
	<Paper data_id={paper_id} />
	<Slide animate class="place-content-center" in={() => (currentPerson.set(undefined))}>
		<div class={slideStyle}>
			<h1
				data-id="student-math-question"
				class="h-1/5 place-content-center text-balance pb-2 text-xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
			>
				How many students are here?
			</h1>
			<div
				data-id="student-math-grid"
				class="grid h-4/5 w-full grid-flow-col grid-cols-[2fr_1fr_2fr_1fr_2fr] grid-rows-[2fr_1fr] place-content-around gap-4"
			>
				<div
					data-id="student-math-total"
					class="grid auto-cols-fr grid-flow-col grid-rows-3 place-content-center gap-2"
				>
					{#each students as studentTotal}
						{#if studentLogMap.get(studentTotal.id)?.here}
							<NameButton
								person={studentTotal}
								data_id={'student-button-' + studentTotal.id}
								style={'max-h-32 truncate rounded-full px-2'}
								avatarStyle={''}
								showName={false}
								nameStyle={'text-xs sm:text-2xl xl:text-4xl 2xl:text-4xl'}
							/>
						{/if}
					{/each}
				</div>
				<div>
					<h1 class="text-md text-balance sm:text-xl lg:text-3xl xl:text-5xl 2xl:text-8xl">
						{numStudents}
					</h1>
					<h3 class="text-md sm:text-md text-balance lg:text-xl xl:text-3xl 2xl:text-5xl">
						Students
					</h3>
				</div>
				<div></div>
				<div class=" ">
					<h1 class="text-xl sm:text-2xl lg:text-4xl xl:text-7xl 2xl:text-9xl">-</h1>
				</div>
				<div
					data-id="student-math-total"
					class="grid auto-cols-fr grid-flow-col grid-rows-3 place-content-center gap-2"
				>
					{#each students as studentTotal}
						{#if studentLogMap.get(studentTotal.id)?.here === 'absent'}
							<NameButton
								person={studentTotal}
								logMap={studentLogMap}
								data_id={'student-button-' + studentTotal.id}
								style={'max-h-32 truncate rounded-full px-2'}
								avatarStyle={''}
								showName={false}
								nameStyle={'text-xs sm:text-2xl xl:text-4xl 2xl:text-4xl'}
							/>
						{/if}
					{/each}
				</div>

				<div>
					<h1 class="text-md text-balance sm:text-xl lg:text-3xl xl:text-5xl 2xl:text-8xl">
						{numStudentsAbsent}
					</h1>
					<h3 class="text-md sm:text-md text-balance lg:text-xl xl:text-3xl 2xl:text-5xl">
						Students
					</h3>
				</div>

				<div></div>
				<div class=" ">
					<h1 class="text-xl sm:text-2xl lg:text-4xl xl:text-7xl 2xl:text-9xl">=</h1>
				</div>
			</div>
		</div></Slide
	>

	<Slide animate class="place-content-center" in={() => (currentPerson.set(undefined))}>
		<div class={slideStyle}>
			<h1
				data-id="student-math-answer"
				class="h-1/5 place-content-center text-balance pb-2 text-xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
			>
				There are {' '}{numStudentsPresent}{' '}students are here today!
			</h1>
			<div
				data-id="student-math-grid"
				class="grid h-4/5 w-full grid-flow-col grid-cols-[2fr_1fr_2fr_1fr_2fr] grid-rows-[2fr_1fr] place-content-around gap-4"
			>
				<div
					data-id="student-math-total"
					class="grid auto-cols-fr grid-flow-col grid-rows-3 place-content-center gap-2"
				>
					{#each students as studentTotal}
						{#if studentLogMap.get(studentTotal.id)?.here}
							<NameButton
								person={studentTotal}
								data_id={'student-button-' + studentTotal.id}
								style={'max-h-32 truncate rounded-full px-2'}
								avatarStyle={''}
								showName={false}
								nameStyle={'text-xs sm:text-2xl xl:text-4xl 2xl:text-4xl'}
							/>
						{/if}
					{/each}
				</div>
				<div>
					<h1 class="text-md text-balance sm:text-xl lg:text-3xl xl:text-5xl 2xl:text-8xl">
						{numStudents}
					</h1>
					<h3 class="text-md sm:text-md text-balance lg:text-xl xl:text-3xl 2xl:text-5xl">
						Students
					</h3>
				</div>
				<div></div>
				<div class=" ">
					<h1 class="text-xl sm:text-2xl lg:text-4xl xl:text-7xl 2xl:text-9xl">-</h1>
				</div>
				<div
					data-id="student-math-total"
					class="grid auto-cols-fr grid-flow-col grid-rows-3 place-content-center gap-2"
				>
					{#each students as studentTotal}
						{#if studentLogMap.get(studentTotal.id)?.here === 'absent'}
							<NameButton
								person={studentTotal}
								logMap={studentLogMap}
								data_id={'student-button-' + studentTotal.id}
								style={'max-h-32 truncate rounded-full px-2'}
								avatarStyle={''}
								showName={false}
								nameStyle={'text-xs sm:text-2xl xl:text-4xl 2xl:text-4xl'}
							/>
						{/if}
					{/each}
				</div>

				<div>
					<h1 class="text-md text-balance sm:text-xl lg:text-3xl xl:text-5xl 2xl:text-8xl">
						{numStudentsAbsent}
					</h1>
					<h3 class="text-md sm:text-md text-balance lg:text-xl xl:text-3xl 2xl:text-5xl">
						Students
					</h3>
				</div>

				<div></div>
				<div class=" ">
					<h1 class="text-xl sm:text-2xl lg:text-4xl xl:text-7xl 2xl:text-9xl">=</h1>
				</div>

				<div
					data-id="student-math-total"
					class="grid auto-cols-fr grid-flow-col grid-rows-3 place-content-center gap-2"
				>
					{#each students as studentTotal}
						{#if studentLogMap.get(studentTotal.id)?.here === 'present'}
							<NameButton
								person={studentTotal}
								logMap={studentLogMap}
								data_id={'student-button-' + studentTotal.id}
								style={'max-h-32 truncate rounded-full px-2'}
								avatarStyle={''}
								showName={false}
								nameStyle={'text-xs sm:text-2xl xl:text-4xl 2xl:text-4xl'}
							/>
						{/if}
					{/each}
				</div>

				<div>
					<h1 class="text-md text-balance sm:text-xl lg:text-3xl xl:text-5xl 2xl:text-8xl">
						{numStudentsPresent}
					</h1>
					<h3 class="text-md sm:text-md text-balance lg:text-xl xl:text-3xl 2xl:text-5xl">
						Students
					</h3>
				</div>
			</div>
		</div>
	</Slide>
</Slide>
