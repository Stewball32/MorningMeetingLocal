<script lang="ts">
	import { goto } from '$app/navigation';
	import PersonButton from '$lib/slideAssets/buttons/PersonButton.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { pathname, students } = data;

	const studentUrl = async (studentId: string) => {
		await goto(`${pathname}/${studentId}`);
	};
</script>

<div class="gap-18 flex flex-row flex-wrap items-center justify-center overflow-scroll p-10">
	{#each students as student (student.id)}
		<div class="h-64">
			<PersonButton
				onclick={() => studentUrl(student.id)}
				class="h1 h-full w-full p-5 pl-10 text-9xl"
				person={student}
			/>
		</div>
	{/each}
</div>
