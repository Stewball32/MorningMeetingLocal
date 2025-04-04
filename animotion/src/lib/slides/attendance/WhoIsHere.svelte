<script lang="ts">
	import Paper from '$lib/Paper.svelte'
	import { Slide } from '@animotion/core'
	import { slideStyle } from '$lib'
	import NameButton from '$lib/slides/attendance/NameButton.svelte'
	import { pb } from '$lib/pb'
	import type { Student, StudentLog, Teacher, TeacherLog } from '$lib/pb'
	import { getPresentation } from '@animotion/core'
	import { onMount } from 'svelte'
	import TestButton from './TestButton.svelte'
	import { currentPerson } from '$lib'

	let presentation = getPresentation()

	type Person = Student | Teacher

	interface Props {
		header?: string
		subheader?: string
		// currentPerson?: Person
		people?: Person[]
		peopleLogMap?: Map<string, StudentLog | TeacherLog>
		paper_id?: string
	}

	let {
		header,
		subheader,
		// currentPerson = $bindable(undefined), // Not currently in use, meant for later implementation
		people = [],
		peopleLogMap = $bindable(new Map<string, StudentLog | TeacherLog>()),
		paper_id
	}: Props = $props()

	const changeSlide = (person: Person) => {
		const currentIndices = presentation.slides.getIndices()
		const personIndex = people.findIndex((p) => p.id === person.id)
		if (personIndex === -1) return // person not found in the array
		presentation.slides.slide(currentIndices.h, personIndex + 1)
	}

	const youtubeUrl = (person: Student | Teacher, embedded: boolean = true) => {
		const videoId = person.video_id
		const start = person.video_start ? `&start=${person.video_start}` : ''
		const end = person.video_end ? `&end=${person.video_end}` : ''
		const baseUrl = embedded ? 'https://www.youtube.com/embed/' : 'https://www.youtube.com/watch?v='
		return `${baseUrl}${videoId}?rel=0&enablejsapi=1&autoplay=0${start}${end}`
	}

	const createNewLog = (person: Person, clickedHere: boolean) => {
		// get today without time
		const today = new Date()

		let logData: { date: string; here: string; student?: string; teacher?: string } = {
			date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
			here: clickedHere ? 'present' : 'absent'
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

	const toggleAttendence = (isHere: 'present' | 'absent' | "", clickedHere: boolean) => {
		switch (isHere) {
			case 'present':
				return clickedHere ? null : 'absent'
			case 'absent':
				return clickedHere ? 'present' : null
			default:
				return clickedHere ? 'present' : 'absent'
		}
	}

	const submitPersonAttendance = (person: Person, clickedHere: boolean) => {
		const personLog = peopleLogMap.get(person.id)
		if (!personLog) return createNewLog(person, clickedHere)

		const updatedPresent = toggleAttendence(personLog.here, clickedHere)
		try {
			pb.collection(personLog.collectionName).update(personLog.id, { here: updatedPresent })
		} catch (error) {
			console.error(error)
		}
	}

	const pronounName = (pronoun?: string) => {
		switch (pronoun) {
			case 'he':
				return 'He'
			case 'she':
				return 'She'
			default:
				return 'They'
		}
	}

	const pronounVerb = (pronoun?: string) => {
		switch (pronoun) {
			case 'he':
				return 'is'
			case 'she':
				return 'is'
			default:
				return 'are'
		}
	}
</script>

<Slide class="place-items-center">
	<Paper data_id={paper_id} />
	<Slide animate class="place-content-center" in={() => currentPerson.set(undefined)}>
		<div class={slideStyle}>
			<div data-id="attendance-student-bar" class="flex h-[10%] w-full justify-evenly">
				{#each people as personBar}
					<NameButton
						person={personBar}
						logMap={peopleLogMap}
						data_id={'student-button-' + personBar.id}
						style={'h-full'}
						avatarStyle={''}
						nameStyle={'text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl truncate'}
						onClick={() => changeSlide(personBar)}
					/>
				{/each}
			</div>

			<div class="h-[80%] w-full">
				<div class="flex h-full w-full flex-col items-center justify-center gap-4 sm:gap-8">
					<h1 class="text-balance text-2xl sm:text-6xl lg:text-8xl">
						{header ?? 'Who is here?'}
					</h1>
					{#if subheader}
						<h2 class="text-balance text-2xl sm:text-4xl lg:text-6xl">{subheader}</h2>
					{/if}
				</div>
			</div>
		</div>
	</Slide>
	{#each people as personSlide}
		<Slide
			animate
			class="place-content-center"
			in={() => currentPerson.set(personSlide)}
			out={() => currentPerson.set(undefined)}
		>
			<div class={slideStyle}>
				<div data-id="attendance-student-bar" class="flex h-[10%] w-full justify-evenly">
					{#each people as studentBar}
						{#if studentBar.id !== personSlide?.id}
							<NameButton
								person={studentBar}
								logMap={peopleLogMap}
								data_id={'student-button-' + studentBar.id}
								style="h-full"
								avatarStyle=""
								nameStyle="text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl truncate truncate"
								onClick={() => changeSlide(studentBar)}
							/>
						{/if}
					{/each}
				</div>

				<div data-id="attendance-student-video" class="mt-4 h-[60%] w-full">
					<iframe
						class="aspect-video h-full"
						frameborder="0"
						src={youtubeUrl(personSlide)}
						title={personSlide.name + "'s Morning Video"}
					></iframe>
				</div>
				<div
					data-id="attendance-student-question"
					class="flex h-[15%] w-full items-center justify-center 2xl:h-[15%]"
				>
					<h1 class="text-bold text-md pr-4 sm:text-lg md:text-3xl lg:text-4xl xl:text-6xl">Is</h1>
					<NameButton
						person={personSlide}
						logMap={peopleLogMap}
						data_id={'student-button-' + personSlide.id}
						style={'h-5/6   px-4 py-1'}
						avatarStyle={'h-32px'}
						nameStyle={'text-bold truncate text-md sm:text-lg md:text-3xl lg:text-4xl xl:text-6xl'}
						onClick={() => changeSlide(personSlide)}
					/>
					<h1 class="text-bold text-md text-md pl-4 sm:text-lg md:text-3xl lg:text-4xl xl:text-6xl">
						here today?
					</h1>
				</div>
				<div
					data-id="attendance-student-answer"
					class="flex h-[10%] w-full items-center justify-evenly gap-8"
				>
					<button
						onclick={() => submitPersonAttendance(personSlide, true)}
						class="btn preset-tonal-success rounded-full"
					>
						<h1
							data-id="here-pronoun"
							class="text-md pr-2 sm:text-lg md:text-3xl lg:text-4xl xl:text-6xl"
						>
							{pronounName(personSlide.pronoun)}
						</h1>
						<h1
							data-id="here-verb"
							class="text-md pr-2 sm:text-lg md:text-3xl lg:text-4xl xl:text-6xl"
						>
							{pronounVerb(personSlide.pronoun)}
						</h1>
						<h1 class="text-md sm:text-lg md:text-3xl lg:text-4xl xl:text-6xl">here!</h1>
					</button>
					<!-- <a
						href={youtubeUrl(personSlide, false)}
						target="_blank"
						rel="noopener noreferrer"
						class="preset-tonal-surface-500 h-full w-auto rounded-3xl px-2"
					>
						<img class="h-full w-auto" src="/youtube.png" alt="" />
					</a> -->
					<TestButton answer={undefined} />
					<button
						onclick={() => submitPersonAttendance(personSlide, false)}
						class="btn preset-tonal-error rounded-full"
					>
						<h1
							data-id="here-pronoun"
							class="text-md pr-2 sm:text-lg md:text-3xl lg:text-4xl xl:text-6xl"
						>
							{pronounName(personSlide.pronoun)}
						</h1>
						<h1
							data-id="here-verb"
							class="text-md pr-2 sm:text-lg md:text-3xl lg:text-4xl xl:text-6xl"
						>
							{pronounVerb(personSlide.pronoun)}n't
						</h1>
						<h1 class="text-md sm:text-lg md:text-3xl lg:text-4xl xl:text-6xl">here.</h1>
					</button>
				</div>
			</div>
		</Slide>
	{/each}
</Slide>
