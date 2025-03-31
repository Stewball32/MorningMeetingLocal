<script lang="ts">
	import { pb } from '$lib/pb'
	import type { Student, StudentLog, Teacher, TeacherLog } from '$lib/pb'
	import Paper from '$lib/Paper.svelte'
	import { getPresentation, Presentation, Slide, Slides, Transition } from '@animotion/core'
	import { slideStyle } from '$lib'
	import { onMount } from 'svelte'
	import NameButton from './NameButton.svelte'
	import StudentMath from './StudentMath.svelte'
	import WhoIsHere from './WhoIsHere.svelte'
	import TeacherMath from './TeacherMath.svelte'

	let presentation = getPresentation()

	interface Props {
		students?: Student[]
		teachers?: Teacher[]
		studentLogMap?: Map<string, StudentLog>
		teacherLogMap?: Map<string, TeacherLog>
	}

	let {
		students = [],
		teachers = [],
		studentLogMap = new Map<string, StudentLog>(),
		teacherLogMap = new Map<string, TeacherLog>()
	}: Props = $props()

	let currentPerson: Student | Teacher | undefined = $state(undefined)
</script>

<!-- Student Attendance-->
<WhoIsHere
	header="Which Students are here today?"
	subheader="Click on a student!"
	bind:currentPerson
	people={students}
	peopleLogMap={studentLogMap}
	paper_id="student-attendance-paper"
/>

<!-- Student Math-->
<StudentMath
	{studentLogMap}
	{students}
	bind:currentPerson
	paper_id="student-attendance-math-paper"
/>

<!-- Teacher Attendance-->
<WhoIsHere
	header="Which Teachers are here today?"
	subheader="Click on a teacher!"
	bind:currentPerson
	people={teachers}
	peopleLogMap={teacherLogMap}
	paper_id="teacher-attendance-paper"
/>

<!-- Teacher Math-->
<TeacherMath
	{students}
	{studentLogMap}
	{teachers}
	{teacherLogMap}
	bind:currentPerson
	paper_id="teacher-attendance-math-paper"
/>

<Slide class="place-items-center">
	<Paper data_id="paper-attendance-thank-you" />
	<Slide class="place-content-center" in={() => (currentPerson = undefined)}>
		<div class={slideStyle}>
			<h1 class="text-5xl h-[15%] place-content-center">Thank you for taking Attendance!</h1>
				<div class="flex h-[85%] flex-row place-content-around flex-wrap w-full justify-evenly gap-12">
					{#each students as student}
						<NameButton
							person={student}
							data_id={'student-button-' + student.id}
							style={'h-20 truncate rounded-2xl px-2 lg:text-2xl xl:text-3xl 2xl:text-4xl'}
							avatarStyle={' h-full'}
							nameStyle={''}
						/>
					{/each}
					{#each teachers as teacher}
						<NameButton
							person={teacher}
							data_id={'teacher-button-' + teacher.id}
							style={'h-20 truncate rounded-2xl px-2 lg:text-2xl xl:text-3xl 2xl:text-4xl'}
							avatarStyle={' h-full'}
							nameStyle={''}
						/>
					{/each}
			</div>
		</div>
	</Slide>
</Slide>

<!-- class="aspect-[16/9] max-h-full max-w-full place-items-center border-2 border-green-500 " -->
