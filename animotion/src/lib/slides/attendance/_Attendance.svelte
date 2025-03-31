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
/>

<!-- Student Math-->
<StudentMath {studentLogMap} {students} bind:currentPerson />

<!-- Teacher Attendance-->

<!-- class="aspect-[16/9] max-h-full max-w-full place-items-center border-2 border-green-500 " -->
