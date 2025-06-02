<script lang="ts">
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import PersonButton from '$lib/buttons/PersonButton.svelte';

	interface PersonBarProps {
		people: Student[] | Teacher[];
		dailyMap: Map<string, StudentDaily | TeacherDaily>;
		currentPerson: Student | Teacher | undefined;
		onClick: (person: Student | Teacher) => void;
	}

	let { people, dailyMap, currentPerson, onClick }: PersonBarProps = $props();

	const getButtonPreset = (person: Student | Teacher) => {
		const daily = dailyMap.get(person.id);
		if (!daily) return 'surface';
		if (daily.here === 'present') return 'success';
		if (daily.here === 'absent') return 'error';
		return 'surface';
	};
</script>

<div class="h-2/12 mx-auto flex w-full justify-evenly p-1 contain-strict">
	{#each people as person}
		{#if person.id !== currentPerson?.id}
			<PersonButton
				{person}
				buttonPreset={getButtonPreset(person)}
				buttonClass="aspect-square p-0"
				showName={false}
				onClick={() => onClick(person)}
			/>
		{/if}
	{/each}
</div>
