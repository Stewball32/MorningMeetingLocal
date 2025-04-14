<script lang="ts">
	import type { Student, StudentDaily, Teacher, TeacherDaily } from "$lib/pb/types";
	import PersonButton from "$lib/PersonButton.svelte";

	interface PersonBarProps {
		people: Student[] | Teacher[];
		dailyMap: Map<string, StudentDaily | TeacherDaily>;
		currentPerson: Student | Teacher | undefined;
		onClick: (person: Student | Teacher) => void;
	}

	let { people, dailyMap, currentPerson, onClick }: PersonBarProps = $props();

</script>

<div class="h-2/12 mx-auto flex w-full justify-evenly p-1 contain-strict">
	{#each people as student}
		{#if student.id !== currentPerson?.id}
			<PersonButton
				person={student}
				daily={dailyMap.get(student.id)}
				style="h-full aspect-square"
				showAvatar={true}
				avatarStyle="h-full"
				showName={false}
				nameStyle="text-center text-sm"
				onClick={() => onClick(student)}
			/>
		{/if}
	{/each}
</div>