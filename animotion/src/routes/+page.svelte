<script lang="ts">
	import type { PageData } from './$types'
	import { Presentation, Slide, Code, Transition, Action, getPresentation } from '@animotion/core'
	import { tween } from '@animotion/motion'
	import Reveal from 'reveal.js'
	import Attendance from '$lib/slides/attendance/_Attendance.svelte'
	import { pb } from '$lib/pb'
	import type { Student, StudentLog, Teacher, TeacherLog } from '$lib/pb'
	import { onMount } from 'svelte'
	import type { RecordSubscription } from 'pocketbase'

	let { data }: { data: PageData } = $props()

	// From presentation.svelte.d.ts
	type Options = {
		reload?: boolean
	}
	const presentationOptions: Reveal.Options & Options = {
		history: true,
		transition: 'slide'
		// disableLayout: true,
		// controls: false,
		// progress: false,
		// embedded: true,
	}

	const presentation = getPresentation()

	let students: Student[] = $state([])
	let teachers: Teacher[] = $state([])
	onMount(async () => {
		try {
			const studentData = (await pb.collection('students').getFullList()) as Student[]
			console.log(studentData)
			students = studentData
			console.log(students)
		} catch (error) {
			console.error(error)
		}

		try {
			const teacherData = (await pb.collection('teachers').getFullList()) as Teacher[]
			teachers = teacherData
		} catch (error) {
			console.error(error)
		}
	})

	let studentLogMap = $state(new Map<string, StudentLog>())
	let teacherLogMap = $state(new Map<string, TeacherLog>())
	onMount(async () => {
		const date = new Date()
		const todayString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
		const filter = `date = "${todayString}"`
		try {
			const studentLogData = await pb
				.collection('student_logs')
				.getList(undefined, undefined, { filter: filter })
			const studentLogs = studentLogData.items as StudentLog[]
			const newStudentMap = new Map(studentLogs.map((studentLog) => [studentLog.student, studentLog]))
			studentLogMap = newStudentMap
		} catch (error) {
			console.error('no student logs found for today')
		}

		try {
			const teacherLogData = await pb
				.collection('teacher_logs')
				.getList(undefined, undefined, { filter: filter })
			const teacherLogs = teacherLogData.items as TeacherLog[]
			const newTeacherMap = new Map(teacherLogs.map((teacherLog) => [teacherLog.teacher, teacherLog]))
			teacherLogMap = newTeacherMap
			
		} catch (error) {
			console.error('no teacher logs found for today')
		}

		pb.collection('student_logs').subscribe('*', (e: RecordSubscription<StudentLog>) => {
			const newStudentMap = new Map(studentLogMap)
			switch (e.action) {
				case 'create':
					newStudentMap.set(e.record.student, e.record)
					break
				case 'update':
					newStudentMap.set(e.record.student, e.record)
					break
				case 'delete':
					newStudentMap.delete(e.record.student)
					break
			}
			studentLogMap = newStudentMap
		})

		pb.collection('teacher_logs').subscribe('*', (e: RecordSubscription<TeacherLog>) => {
			const newTeacherMap = new Map(teacherLogMap)
			switch (e.action) {
				case 'create':
					newTeacherMap.set(e.record.teacher, e.record)
					break
				case 'update':
					newTeacherMap.set(e.record.teacher, e.record)
					break
				case 'delete':
					newTeacherMap.delete(e.record.teacher)
					break
			}
			teacherLogMap = newTeacherMap
		})
	})

	let bgColor = $derived('bg-[#3B82F6]')
</script>

<div class="absolute right-0 top-0 z-10 text-xl text-blue-600">
	<p class="block sm:hidden">XS</p>
	<p class="hidden sm:block md:hidden">SM</p>
	<p class="hidden md:block lg:hidden">MD</p>
	<p class="hidden lg:block xl:hidden">LG</p>
	<p class="hidden xl:block 2xl:hidden">XL</p>
	<p class="hidden 2xl:block">2XL</p>
</div>

<Presentation class={bgColor} options={presentationOptions}>
	<Attendance {students} {teachers} {studentLogMap} {teacherLogMap} />

</Presentation>
