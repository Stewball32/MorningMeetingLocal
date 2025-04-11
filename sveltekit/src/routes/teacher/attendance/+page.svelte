<script lang="ts">
	import type { PageData } from './$types';
	import { pb, updateDaily } from '$lib/pb';
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import { onMount } from 'svelte';
	import type { RecordSubscription } from 'pocketbase';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import PersonButton from '$lib/PersonButton.svelte';
	import { getPronounPresent, getPronounSubject, soundMap } from '$lib';

	let { data }: { data: PageData } = $props();

	const todayDateString = data.todayISOString;
	let students: Student[] = $state(data.students);
	let teachers: Teacher[] = $state(data.teachers);
	let studentDailyMap: Map<string, StudentDaily> = $state(data.studentDailyMap);
	let teacherDailyMap: Map<string, TeacherDaily> = $state(data.teacherDailyMap);
	let currentPerson: Student | Teacher | undefined = $state(students[0]);

	// map of the sounds currently playing
	const activeSoundMap = new Map<string, HTMLAudioElement>();
	const playSound = (id: string, sound: string) => {
		if (!soundMap.has(sound)) {
			console.error(`Sound ${sound} not found in soundMap.`);
			return;
		}
		

	};

	onMount(async () => {
		pb.collection('student_dailies').subscribe('*', (e: RecordSubscription<StudentDaily>) => {
			if (e.record.date !== todayDateString) return;
			const newStudentDailyMap = new Map(studentDailyMap);
			switch (e.action) {
				case 'create':
					newStudentDailyMap.set(e.record.student, e.record);
					break;
				case 'update':
					newStudentDailyMap.set(e.record.student, e.record);
					break;
				case 'delete':
					newStudentDailyMap.delete(e.record.student);
					break;
			}
			studentDailyMap = newStudentDailyMap;
		});
	});

	const youtubeUrl = (person: Student | Teacher, embedded: boolean = true) => {
		const videoId = person.video_id;
		const start = person.video_start ? `&start=${person.video_start}` : '';
		const end = person.video_end ? `&end=${person.video_end}` : '';
		const baseUrl = embedded
			? 'https://www.youtube.com/embed/'
			: 'https://www.youtube.com/watch?v=';
		return `${baseUrl}${videoId}?rel=0&enablejsapi=1&autoplay=0${start}${end}`;
	};

	const updateCurrentPerson = (person?: Student | Teacher) => {
		currentPerson = person;
	};

	const updateAttendance = async (person: Student | Teacher | undefined, isHere: boolean) => {
		if (!person) {
			console.error('No person provided to update attendance.');
			return;
		}
		let dailyMap = person.collectionName === 'students' ? studentDailyMap : teacherDailyMap;
		let daily = dailyMap.get(person.id);
		let here: 'present' | 'absent' | '' = '';
		switch (daily?.here) {
			case 'present':
				here = isHere ? '' : 'absent';
				break;
			case 'absent':
				here = isHere ? 'present' : '';
				break;
			default:
				here = isHere ? 'present' : 'absent';
				break;
		}
		await updateDaily(person, { ...daily, here });
	};
</script>

<div class="h-2/12 absolute top-0 grid w-full grid-cols-12">
	<div class="col-span-1 h-full contain-strict"></div>
	<div class="col-span-10 flex h-full justify-evenly p-1 contain-strict">
		{#each students as student}
			<PersonButton
				person={student}
				daily={studentDailyMap.get(student.id)}
				style="h-full aspect-square"
				showAvatar={true}
				avatarStyle=""
				showName={false}
				nameStyle="text-center text-sm"
				onClick={() => updateCurrentPerson(student)}
			/>
		{/each}
	</div>
	<div class="col-span-1 h-full"></div>
</div>

{#if currentPerson && currentPerson.collectionName === 'students'}
	<div class="h-8/12 top-2/12 absolute flex w-full flex-col justify-center py-2">
		<div class="h-9/12 flex w-full items-center justify-center pb-2">
			<!--iFrame of youtube video with 16/9 ratio-->
			<iframe
				class="rounded-4xl aspect-video h-full"
				src={youtubeUrl(currentPerson)}
				title="YouTube video player"
				frameborder="0"
				allowfullscreen
			></iframe>
		</div>
		<div class="h-3/12 flex w-full items-center justify-center gap-2">
			<h1 class="text-question">Is</h1>
			<PersonButton
				person={currentPerson}
				daily={currentPerson ? studentDailyMap.get(currentPerson.id) : undefined}
				style="h-full "
				showAvatar={true}
				avatarStyle="h-full -px-6"
				showName={true}
				nameStyle="text-question"
			/>
			<h1 class="text-question">here today?</h1>
		</div>
	</div>

	<div class="h-2/12 absolute bottom-0 flex w-full justify-evenly pt-1">
		<button onclick={() => updateAttendance(currentPerson, true)}  class="btn preset-filled-success-500 text-answer col-span-2 rounded-full border">
			{getPronounSubject(currentPerson)}
			{getPronounPresent(currentPerson)}
			here!
		</button>
		<a href={youtubeUrl(currentPerson)} class="btn col-span-1 overflow-hidden rounded-full">
			<img class="h-full rounded-full" src="/youtube.png" alt="" />
		</a>
		<button onclick={() => updateAttendance(currentPerson, false)}  class="btn preset-filled-error-500 text-answer col-span-2 rounded-full border">
			{getPronounSubject(currentPerson)}
			{getPronounPresent(currentPerson) + "n't"}
			here.
		</button>
	</div>
{/if}
