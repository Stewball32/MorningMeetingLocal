<script lang="ts">
	import { pb } from '$lib/pb'
	import type { Student, StudentLog, Teacher, TeacherLog } from '$lib/pb'
	import Paper from '$lib/Paper.svelte'
	import { getPresentation, Presentation, Slide, Slides, Transition } from '@animotion/core'
	import { slideStyle } from '$lib'
	import { onMount } from 'svelte'

	let presentation = getPresentation()

	interface Props {
		students?: Student[]
		teachers?: Teacher[]
	}

	let { students = [], teachers = [] }: Props = $props()

	let studentLogMap = new Map<string, StudentLog>()
	let teacherLogMap = new Map<string, TeacherLog>()
	onMount(async () => {
		const date = new Date()
		const todayString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
		const tomorrowString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`

		const filter = `date = "${todayString}"`
		try {
			const studentLogData = await pb
				.collection('student_logs')
				.getList(undefined, undefined, { filter: filter })
			const studentLogs = studentLogData.items as StudentLog[]
			studentLogMap = new Map(studentLogs.map((studentLog) => [studentLog.student, studentLog]))
		} catch (error) {
			console.error('no student logs found for today')
		}

		try {
			const teacherLogData = await pb
				.collection('teacher_logs')
				.getList(undefined, undefined, { filter: filter })
			const teacherLogs = teacherLogData.items as TeacherLog[]
			teacherLogMap = new Map(teacherLogs.map((teacherLog) => [teacherLog.teacher, teacherLog]))
		} catch (error) {
			console.error('no teacher logs found for today')
		}

	})

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

	let currentPerson: IndexedStudent | undefined = $state(undefined)
	let currentTeacher: IndexedTeacher | undefined = $state(undefined)

	const youtubeUrl = (person: IndexedStudent | IndexedTeacher, embedded: boolean = true) => {
		const videoId = person.video_id
		const start = person.video_start ? `&start=${person.video_start}` : ''
		const end = person.video_end ? `&end=${person.video_end}` : ''
		const baseUrl = embedded ? 'https://www.youtube.com/embed/' : 'https://www.youtube.com/watch?v='
		return `${baseUrl}${videoId}?rel=0&enablejsapi=1&autoplay=0${start}${end}`
		// return `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1&autoplay=0${start}${end}`
	}

	const changeSlide = (person: IndexedStudent | IndexedTeacher) => {
		const currentIndices = presentation.slides.getIndices()
		console.log(currentIndices)
		presentation.slides.slide(currentIndices.h, person.index)
	}

	const createNewLog = (person: IndexedStudent | IndexedTeacher, clickedHere: boolean) => {
		// get today without time
		const today = new Date()

		let logData: { date: string; here: string ; student?: string; teacher?: string } = {
			date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
			here: clickedHere ? 'present' : 'absent',
		}
		if (person.collectionName === 'students') {
			logData.student = person.id
		} else {
			logData.teacher = person.id
		}
		try {
			if (person.collectionName === 'students') {
				pb.collection('student_logs').create(logData)
			} else {
				pb.collection('teacher_logs').create(logData)
			}
		} catch (error) {
			console.error(error)
		}
	}

	const toggleAttendence = (isHere: "present" | "absent" | undefined, clickedHere: boolean) => {
		switch (isHere) {
			case 'present':
				return clickedHere ? null : 'present'
			case 'absent':
				return clickedHere ? 'present' : null
			default:
				return clickedHere ? 'present' : 'absent'
		}
	}

	const submitStudentAttendance = (student: IndexedStudent, clickedHere: boolean) => {
		const studentLog = studentLogMap.get(student.id)
		if (!studentLog) return createNewLog(student, clickedHere)
		
		const updatedPresent = toggleAttendence(studentLog.here, clickedHere)
		try {
			pb.collection('student_logs').update(studentLog.id, { here: updatedPresent })
		} catch (error) {
			console.error(error)
		}
	}
</script>

<!-- Student Attendance-->
<Slide class="place-items-center">
	<Paper data_id="attendance-paper-student" />
	<Slide animate class="place-content-center" in={() => (currentPerson = undefined)}>
		<div class={slideStyle}>
			<div data-id="attendance-student-bar" class="flex h-[10%] w-full justify-evenly">
				{#each indexedStudents as studentBar}
					<button
						onclick={() => changeSlide(studentBar)}
						data-id={'student-button-' + studentBar.id}
						class="btn preset-tonal-surface h-full truncate rounded-2xl px-2 lg:text-2xl xl:text-3xl 2xl:text-4xl"
					>
						{studentBar.name}
					</button>
				{/each}
			</div>

			<div class="h-[80%] w-full">
				<div class="flex h-full w-full flex-col items-center justify-center gap-8">
					<h1 class="text-balance text-8xl">Which Students are here today?</h1>
					<h2 class="text-4xl">Click on a student above!</h2>
				</div>
			</div>
		</div>
	</Slide>
	{#each indexedStudents as studentSlide}
		<Slide
			animate
			class="place-content-center"
			in={() => (currentPerson = studentSlide)}
			out={() => (currentPerson = undefined)}
		>
			<div class={slideStyle}>
				<div data-id="attendance-student-bar" class="flex h-[10%] w-full justify-evenly">
					{#each indexedStudents as studentBar}
						{#if studentBar.id !== studentSlide?.id}
							<button
								data-id={'student-button-' + studentBar.id}
								onclick={() => changeSlide(studentBar)}
								class="btn preset-tonal-surface h-full truncate rounded-2xl px-2 text-3xl"
							>
								{studentBar.name}
							</button>
						{/if}
					{/each}
				</div>

				<div data-id="attendance-student-video" class="m-4 h-[60%] w-full">
					<iframe
						class="aspect-video h-full"
						frameborder="0"
						src={youtubeUrl(studentSlide)}
						title={studentSlide.name + "'s Morning Video"}
					></iframe>
				</div>
				<div
					data-id="attendance-student-question"
					class="flex h-[15%] w-full items-center justify-center"
				>
					<h1 class="text-bold pr-4 text-6xl">Is</h1>
					<button
						data-id={'student-button-' + studentSlide.id}
						class="btn preset-tonal-surface rounded-4xl text-bold truncate px-4 py-1 text-6xl"
						>{studentSlide.name}</button
					>
					<h1 class="text-bold pl-4 text-6xl">here today?</h1>
				</div>
				<div
					data-id="attendance-student-answer"
					class="flex h-[10%] w-full items-center justify-evenly gap-8"
				>
					<button
						onclick={() => submitStudentAttendance(studentSlide, true)}
						class="btn preset-tonal-success rounded-full"
					>
						<h1 data-id="here-pronoun" class="pr-2 text-6xl">
							{#if studentSlide.pronoun === 'he'}
								He
							{:else if studentSlide.pronoun === 'she'}
								She
							{:else}
								They
							{/if}
						</h1>
						<h1 data-id="here-verb" class="pr-2 text-6xl">
							{#if studentSlide.pronoun === 'he'}
								is
							{:else if studentSlide.pronoun === 'she'}
								is
							{:else}
								are
							{/if}
						</h1>
						<h1 class="text-6xl">here!</h1>
					</button>
					<a
						href={youtubeUrl(studentSlide, false)}
						target="_blank"
						rel="noopener noreferrer"
						class="preset-tonal-surface-500 h-full w-auto rounded-3xl px-2"
					>
						<img class="h-full w-auto" src="/youtube.png" alt="" />
					</a>
					<button class="btn preset-tonal-error rounded-full">
						<h1 data-id="here-pronoun" class="pr-2 text-6xl">
							{#if studentSlide.pronoun === 'he'}
								He
							{:else if studentSlide.pronoun === 'she'}
								She
							{:else}
								They
							{/if}
						</h1>
						<h1 data-id="here-verb" class="pr-2 text-6xl">
							{#if studentSlide.pronoun === 'he'}
								isn't
							{:else if studentSlide.pronoun === 'she'}
								isn't
							{:else}
								aren't
							{/if}
						</h1>
						<h1 class="text-6xl">here.</h1>
					</button>
				</div>
			</div>
		</Slide>
	{/each}
</Slide>

<!-- Student Math-->

<!-- Teacher Attendance-->

<!-- class="aspect-[16/9] max-h-full max-w-full place-items-center border-2 border-green-500 " -->
