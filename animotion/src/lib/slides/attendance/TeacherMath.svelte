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
		teachers?: Teacher[]
		teacherLogMap?: Map<string, TeacherLog>
		paper_id?: string
	}

	let {
		students = [],
		studentLogMap = new Map<string, StudentLog>(),
		teachers = [],
		teacherLogMap = new Map<string, TeacherLog>(),
		paper_id
	}: Props = $props()

	const numStudentsPresent = $derived(
		students.filter((student) => studentLogMap.get(student.id)?.here === 'present').length
	)
	const numTeachersPresent = $derived(
		teachers.filter((teacher) => teacherLogMap.get(teacher.id)?.here === 'present').length
	)
	const numPeoplePresent = $derived(numStudentsPresent + numTeachersPresent)
</script>

<Slide class="place-items-center">
	<Paper data_id={paper_id} />
	<Slide animate class="place-content-center" in={() => (currentPerson.set(undefined))}>
		<div class={slideStyle}>
			<h1
				data-id="teacher-math-question"
				class="h-1/5 place-content-center text-balance pb-2 text-xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
			>
				How many people are here?
			</h1>
			<div
				data-id="teacher-math-grid"
				class="grid h-4/5 w-full grid-flow-col grid-cols-[2fr_1fr_2fr_1fr_2fr] grid-rows-[2fr_1fr] place-content-around gap-4"
			>
				<div data-id="teacher-math-students" class="grid auto-cols-fr grid-rows-3 grid-flow-col place-content-center gap-2">
					{#each students as studentHere}
						{#if studentLogMap.get(studentHere.id)?.here === 'present'}
							<NameButton
								person={studentHere}
								logMap={studentLogMap}
								data_id={'student-button-' + studentHere.id}
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
				<div></div>
				<div class=" ">
					<h1 class="text-xl sm:text-2xl lg:text-4xl xl:text-7xl 2xl:text-9xl">+</h1>
				</div>
				<div data-id="teacher-math-teachers" class="grid auto-cols-fr grid-rows-3 grid-flow-col place-content-center gap-2">
					{#each teachers as teacherHere}
						{#if teacherLogMap.get(teacherHere.id)?.here === 'present'}
							<NameButton
								person={teacherHere}
								logMap={teacherLogMap}
								data_id={'student-button-' + teacherHere.id}
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
						{numTeachersPresent}
					</h1>
					<h3 class="text-md sm:text-md text-balance lg:text-xl xl:text-3xl 2xl:text-5xl">
						Teachers
					</h3>
				</div>

				<div></div>
				<div class=" ">
					<h1 class="text-xl sm:text-2xl lg:text-4xl xl:text-7xl 2xl:text-9xl">=</h1>
				</div>
			</div>
		</div>
	</Slide>

	<Slide animate class="place-content-center" in={() => (currentPerson.set(undefined))}>
		<div class={slideStyle}>
			<h1
				data-id="student-math-answer"
				class="h-1/5 place-content-center text-balance pb-2 text-xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
			>
				There are {' '}{numPeoplePresent}{' '}people are here today!
			</h1>
			<div
				data-id="student-math-grid"
				class="grid h-4/5 w-full grid-flow-col grid-cols-[2fr_1fr_2fr_1fr_2fr] grid-rows-[2fr_1fr] place-content-around gap-4"
			>
				<div data-id="teacher-math-students" class="grid auto-cols-fr grid-rows-3 grid-flow-col place-content-center gap-2">
					{#each students as studentHere}
						{#if studentLogMap.get(studentHere.id)?.here === 'present'}
							<NameButton
								person={studentHere}
								logMap={studentLogMap}
								data_id={'student-button-' + studentHere.id}
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
				<div></div>
				<div class=" ">
					<h1 class="text-xl sm:text-2xl lg:text-4xl xl:text-7xl 2xl:text-9xl">+</h1>
				</div>
				<div data-id="teacher-math-teachers" class="grid auto-cols-fr grid-rows-3 grid-flow-col place-content-center gap-2">
					{#each teachers as teacherHere}
						{#if teacherLogMap.get(teacherHere.id)?.here === 'present'}
							<NameButton
								person={teacherHere}
								logMap={teacherLogMap}
								data_id={'student-button-' + teacherHere.id}
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
						{numTeachersPresent}
					</h1>
					<h3 class="text-md sm:text-md text-balance lg:text-xl xl:text-3xl 2xl:text-5xl">
						Teachers
					</h3>
				</div>

				<div></div>
				<div class=" ">
					<h1 class="text-xl sm:text-2xl lg:text-4xl xl:text-7xl 2xl:text-9xl">=</h1>
				</div>

				<div data-id="teacher-math-people" class="grid auto-cols-fr grid-rows-3 grid-flow-col place-content-center gap-2">
					{#each students as studentHere}
						{#if studentLogMap.get(studentHere.id)?.here === 'present'}
							<NameButton
								person={studentHere}
								logMap={studentLogMap}
								data_id={'student-button-' + studentHere.id}
								style={'max-h-32 truncate rounded-full px-2'}
								avatarStyle={''}
								showName={false}
								nameStyle={'text-xs sm:text-2xl xl:text-4xl 2xl:text-4xl'}
							/>
						{/if}
					{/each}
					{#each teachers as teacherTotal}
						{#if teacherLogMap.get(teacherTotal.id)?.here === 'present'}
							<NameButton
								person={teacherTotal}
								logMap={teacherLogMap}
								data_id={'student-button-' + teacherTotal.id}
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
						{numPeoplePresent}
					</h1>
					<h3 class="text-md sm:text-md text-balance lg:text-xl xl:text-3xl 2xl:text-5xl">
						People
					</h3>
				</div>
			</div>
		</div>
	</Slide>
</Slide>
