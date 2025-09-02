<script lang="ts">
	import type { PageData } from './$types';
	import { Tabs, Switch, Segment } from '@skeletonlabs/skeleton-svelte';
	import { FileUpload, type FileUploadApi } from '@skeletonlabs/skeleton-svelte';
	import { Person } from '$lib/pb/objects';
	import IconAvatar from '@lucide/svelte/icons/image';
	import IconDropzone from '@lucide/svelte/icons/image-plus';
	import IconFile from '@lucide/svelte/icons/paperclip';
	import IconRemove from '@lucide/svelte/icons/circle-x';
	import IconReset from '@lucide/svelte/icons/refresh-cw'; //rotate-ccw
	import { onMount } from 'svelte'; // Icons
	import IconLeft from '@lucide/svelte/icons/align-left';
	import IconCenter from '@lucide/svelte/icons/align-center';
	import IconRight from '@lucide/svelte/icons/align-right';
	import IconJustify from '@lucide/svelte/icons/align-justify';

	let align = $state('left');
	import type { ComponentProps } from 'svelte';
	import { AppleIcon } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();
	let people = $state(data.people);
	let currentPerson = $state<Person | null>(people[0]);

	let tab = $state('all');
	let filteredPeople = $state(people);

	let avatarApi: FileUploadApi;
	let newAvatarUrl = $state<string>('');
	let newAvatarFile: File | null | undefined = undefined;

	let form = $state<{
		avatarUrl?: string;
		name?: string;
		role?: 'student' | 'teacher';
		title?: string;
		pronoun?: string;
	} | null>(null);

	$effect(() => {
		if (currentPerson) {
			form = {
				avatarUrl: currentPerson.avatarUrl ?? '',
				name: currentPerson.name ?? '',
				role: currentPerson.role ?? 'student',
				title: currentPerson.title ?? '',
				pronoun: currentPerson.pronoun ?? ''
			};
			newAvatarUrl = '';
		} else {
			form = null;
		}
	});

	type TabChangeDetails = Parameters<NonNullable<ComponentProps<typeof Tabs>['onValueChange']>>[0];
	const updateFilteredPeople = (e: TabChangeDetails) => {
		tab = e.value;
		if (tab === 'all') {
			filteredPeople = people;
		} else {
			filteredPeople = people.filter((p) => p.role === tab);
		}
	};

	const updatePronoun = (pronoun: string | undefined | null) => {
		if (!form) return;
		if (!pronoun) return (form.pronoun = '');
		form.pronoun = form.pronoun === pronoun ? '' : pronoun;
	};

	const savePerson = () => {
		console.log('savePerson', form);
	};

	function resetForm() {
		if (!currentPerson) return;
		const p = currentPerson;
		currentPerson = null; // retrigger effect
		currentPerson = p;
		avatarApi.clearFiles();
	}

	type FileChangeDetails = Parameters<
		NonNullable<ComponentProps<typeof FileUpload>['onFileChange']>
	>[0];
	const avatarChange = (details: FileChangeDetails) => {
		newAvatarFile = details.acceptedFiles[0];
		if (!newAvatarFile) {
			newAvatarUrl = '';
		}
		const reader = new FileReader();
		reader.onload = (event) => {
			const image = event?.target?.result;
			newAvatarUrl = `${image ?? ''}`; // I'm sorry
		};
		reader.readAsDataURL(newAvatarFile);
	};

	const roleInputClass = (person: Person, role: 'student' | 'teacher') => {
		return person.role === role
			? 'preset-filled-surface-300-700'
			: 'preset-outline-surface-300-700';
	};
</script>

<div class="flex h-full flex-col justify-around gap-1 px-1 xl:flex-row xl:justify-evenly">
	<div class="w-full outline-2 xl:w-5/12">
		<div class="card h-full p-4">
			{#if currentPerson && form}
				<form class="grid w-full grid-cols-1 gap-3" onsubmit={savePerson}>
					<div class="grid grid-cols-5 items-center gap-3">
						<div class="col-span-1 flex flex-col items-center justify-between gap-2">
							<label
								for="person-avatar"
								class={'label w-full text-center ' + (!newAvatarUrl ? 'font-bold' : 'italic')}
							>
								Avatar
							</label>
							<FileUpload
								ids={{ root: 'person-avatar' }}
								name="person-avatar"
								label="Upload Avatar"
								accept="image/*"
								maxFiles={1}
								onFileChange={avatarChange}
								onFileReject={console.error}
								onApiReady={(_api) => (avatarApi = _api)}
								classes="size-18 rounded-full overflow-hidden outline-2 grid place-items-center"
							>
								<img
									class="max-h-18 max-w-18 object-center"
									src={newAvatarUrl || currentPerson?.avatarUrl}
									alt="avatar"
									loading="lazy"
								/>
							</FileUpload>

							<code class="truncate text-xs opacity-70">
								{#if currentPerson?.id}
									ID: {currentPerson.id}
								{/if}
							</code>
						</div>
						<div class="col-span-3 grid grid-cols-4 gap-2">
							<div class="col-span-1">
								<label
									for="pronoun-select"
									class={'label w-full text-center ' +
										(currentPerson.pronoun === form?.pronoun ? 'font-bold' : 'italic')}
								>
									Pronoun
								</label>
								<div id="person-title-input" class="gap- grid w-full grid-cols-2 gap-3">
									<button
										onclick={(e) => {
											e.preventDefault();
											updatePronoun('he');
										}}
										class={'btn rounded-full border border-blue-300 ' +
											(form.pronoun === 'he' ? 'bg-blue-200' : '')}
									>
										He
									</button>
									<button
										onclick={(e) => {
											e.preventDefault();
											updatePronoun('she');
										}}
										class={'btn rounded-full border border-pink-300 ' +
											(form.pronoun === 'she' ? 'bg-pink-200' : '')}
									>
										She
									</button>
								</div>
								<!-- <div id="pronoun-select" class="grid w-full grid-cols-2 gap-3">
									<button
										onclick={(e) => {
											e.preventDefault();
											updatePronoun('he');
										}}
										class={'btn flex-1 rounded-full ' +
											(form.pronoun === 'he'
												? ' bg-blue-600 outline-2 outline-blue-900'
												: 'bg-blue-300 opacity-75')}
									>
										He
									</button>
									<button
										onclick={(e) => {
											e.preventDefault();
											updatePronoun('she');
										}}
										class={'btn flex-1 rounded-full ' +
											(form.pronoun === 'she'
												? ' bg-pink-600 outline-2 outline-pink-900'
												: 'bg-pink-300 opacity-75')}
									>
										She
									</button>
								</div> -->
							</div>
							<div class="col-span-3">
								<label
									for="person-title-input"
									class={'label w-full text-center ' +
										(currentPerson.role === form?.role ? 'font-bold' : 'italic')}
								>
									Role
								</label>
								<div id="person-title-input" class="grid w-full grid-cols-2 gap-3 px-3">
									<button
										onclick={(e) => {
											e.preventDefault();
											if (form) form.role = 'student';
										}}
										class={'btn preset-outlined-surface-200-800 rounded-full ' +
											(form.role === 'student' ? 'bg-surface-50-950 border-2' : '')}
									>
										Student
									</button>
									<button
										onclick={(e) => {
											e.preventDefault();
											if (form) form.role = 'teacher';
										}}
										class={'btn preset-outlined-surface-200-800 rounded-full ' +
											(form.role === 'teacher' ? 'bg-surface-50-950 border-2' : '')}
									>
										Teacher
									</button>
								</div>
							</div>
							<div class=" col-span-1">
								<label
									for="person-title-input"
									class={'label w-full text-center ' +
										(currentPerson.title === form?.title ? 'font-bold' : 'italic')}
								>
									Title
								</label>
								<input
									id="person-title-input"
									type="text"
									disabled={form?.role === 'student'}
									placeholder={form?.role !== 'student' ? currentPerson.title || 'Title' : 'N/A'}
									class={'input w-full rounded-full placeholder:font-normal placeholder:italic placeholder:opacity-30 '}
									bind:value={form.title}
								/>
							</div>
							<div class="col-span-3">
								<label
									for="person-name-input"
									class={'label w-full text-center font-bold ' +
										(currentPerson.name === form?.name ? 'font-bold' : 'italic')}
								>
									Name*
								</label>
								<input
									id="person-name-input"
									class={'input w-full rounded-full placeholder:font-normal placeholder:italic placeholder:opacity-30'}
									type="text"
									placeholder={currentPerson.name || 'Name'}
									bind:value={form.name}
									required
								/>
							</div>
						</div>
						<div class="grid grid-cols-1 gap-2">
							<button
								type="button"
								class="btn preset-filled-secondary-500 rounded-full border"
								onclick={resetForm}>Reset</button
							>
							<button type="button" class="btn preset-filled-error-500 rounded-full border">
								Close
							</button>
							<button type="submit" class="btn preset-filled-success-500 rounded-full border">
								Update
							</button>
						</div>
					</div>
				</form>
			{:else}
				<div
					class="flex h-full items-center justify-center rounded-md border border-dashed p-6 text-center opacity-70"
				>
					Select a person to edit
				</div>
			{/if}
		</div>
	</div>

	<Tabs
		value={tab}
		onValueChange={updateFilteredPeople}
		base="flex h-full min-h-0 flex-col"
		classes="table-wrap h-2/5 w-full xl:h-full xl:w-6/12"
		contentBase="flex-1 min-h-0"
		fluid
	>
		{#snippet list()}
			<Tabs.Control value="all">All</Tabs.Control>
			<Tabs.Control value="student">Students</Tabs.Control>
			<Tabs.Control value="teacher">Teachers</Tabs.Control>
		{/snippet}

		{#snippet content()}
			<!-- active panel must also allow its child to scroll -->
			<table class="table min-w-full caption-top border-separate border-spacing-0">
				<colgroup>
					<col class="w-8" />
					<col class="w-12" />
					<col />
					<col />
					<col class="w-20" />
				</colgroup>

				<thead class="preset-filled-primary-100-900 sticky top-0 z-10">
					<tr>
						<th>Avatar</th>
						<th>Title</th>
						<th>Name</th>
						<th>Pronoun</th>
						<th>Role</th>
						<th>Classrooms</th>
						<th class="!text-right">ID</th>
					</tr>
				</thead>

				<tbody>
					{#each filteredPeople as person}
						<tr
							onclick={() => (currentPerson = person)}
							class={'cursor-pointer ' +
								(currentPerson?.id === person.id
									? ' preset-tonal-primary'
									: 'hover:preset-filled-primary-200-800')}
						>
							<td class="overflow-hidden">
								<div class=" flex size-12 justify-center overflow-hidden">
									<img
										class="h-full"
										src={person.avatarUrl}
										alt={`${person.name}'s Avatar`}
										loading="lazy"
									/>
								</div>
							</td>

							<td>{person.title}</td>
							<td class="whitespace-nowrap">{person.name}</td>
							<td>{person.pronoun}</td>

							<td>
								{person.role.charAt(0).toUpperCase() + person.role.slice(1)}
							</td>
							<td>{person.record.classrooms_active.length}</td>
							<td class="!text-right text-xs">
								{person.id}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/snippet}
	</Tabs>
</div>
