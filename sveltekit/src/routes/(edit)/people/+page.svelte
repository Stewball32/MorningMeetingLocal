<script lang="ts">
	import type { PageData } from './$types';
	import type {
		PersonConfig,
		PersonPB,
		PersonQuestionNumber,
		PersonQuestionString,
		PersonRating
	} from '$lib/pb/schema/index';
	import { type Person, type Classroom, SchoolBuilder, ImageAsset } from '$lib/pb';
	import { PlusIcon, RefreshCcwIcon, SaveIcon, SearchIcon, Trash2Icon } from '@lucide/svelte';
	import { Avatar, FileUpload } from '@skeletonlabs/skeleton-svelte';
	import PersonConfigPanel from '$lib/config/Person.svelte';
	import { toaster } from '$lib/toaster';

	type RoleFilter = 'all' | 'student' | 'teacher';
	type FilledConfig = PersonConfig & {
		poll: { num: PersonQuestionNumber; str: PersonQuestionString };
		quiz: { num: PersonQuestionNumber; str: PersonQuestionString };
		rating: PersonRating;
		video: { id: string; start?: number; end?: number };
	};

	type PersonForm = {
		id?: string;
		name: string;
		role: 'student' | 'teacher';
		title: string;
		pronoun: 'he' | 'she' | 'they' | null;
		avatarPath: string;
		avatar: File | null;
		config: FilledConfig;
	};

	let { data }: { data: PageData } = $props();

	let loadError = $state(data.loadError ?? '');
	let people = $state<Person[]>(data.people ?? []);
	let classrooms = $state<Classroom[]>(data.classrooms ?? []);
  let imageAssets = $state<ImageAsset[]>(data.ImageAssets ?? [])
	let emotions = $derived(imageAssets.filter(i => i.tags.includes("emotion")));

	const defaultConfig: FilledConfig = {
		poll: {
			num: { type: 'multi', options: 4 },
			str: { type: 'multi', options: 4 }
		},
		quiz: {
			num: { type: 'multi', options: 4 },
			str: { type: 'multi', options: 4 }
		},
		rating: { type: 'smileys', options: 3 },
		video: { id: '', start: 0, end: 0 }
	};

	const mergeConfig = (config?: PersonConfig): FilledConfig => ({
		...defaultConfig,
		emotions: config?.emotions ?? defaultConfig.emotions,
		poll: {
			num: config?.poll?.num ?? defaultConfig.poll.num,
			str: config?.poll?.str ?? defaultConfig.poll.str
		},
		quiz: {
			num: config?.quiz?.num ?? defaultConfig.quiz.num,
			str: config?.quiz?.str ?? defaultConfig.quiz.str
		},
		rating: config?.rating ?? defaultConfig.rating,
	});

	const createEmptyPersonForm = (): PersonForm => ({
		name: '',
		role: 'student',
		title: '',
		pronoun: null,
		avatarPath: '',
		avatar: null,
		config: structuredClone(defaultConfig)
	});

	const mapFromPerson = (person: Person): PersonForm => ({
		id: person.id,
		name: person.name ?? '',
		role: person.role ?? 'student',
		title: person.title ?? '',
		pronoun: (person.pronoun as PersonForm['pronoun']) ?? null,
		avatarPath: person.avatarPath ?? '',
		avatar: null,
		config: mergeConfig(person.config)
	});

	let roleFilter = $state<RoleFilter>('all');
	let searchTerm = $state('');

	const getActiveClassroomCount = (personId: string) => {
		return classrooms.reduce(
			(count, classroom) => count + (classroom.peopleIds.includes(personId) ? 1 : 0),
			0
		);
	};

	const visiblePeople = $derived.by(() => {
		let next = people;
		if (roleFilter !== 'all') next = next.filter((p) => p.role === roleFilter);
		if (searchTerm.trim()) {
			const q = searchTerm.trim().toLowerCase();
			next = next.filter((p) => p.name.toLowerCase().includes(q));
		}
		return next.toSorted((a, b) => a.name.localeCompare(b.name));
	});

  let activePersonId = $state<string | null>(null);
  let activePerson = $state<Person | null>(null)
  let personForm = $state<PersonForm>(createEmptyPersonForm()
  );
	let avatarPreview = $state('');

	$effect(() => {
		if (activePersonId) {
			const current = people.find((p) => p.id === activePersonId);
			if (current) {
				personForm = mapFromPerson(current);
        activePerson = current
			} else {
				activePersonId = null;
				personForm = createEmptyPersonForm();
        activePerson = null
			}
		} else {
			personForm = createEmptyPersonForm();
		}
		avatarPreview = '';
	});

	const selectPerson = (id: string) => {
		activePersonId = id;
	};

	const startNewPerson = () => {
		activePersonId = null;
    activePerson = null;
		personForm = createEmptyPersonForm();
		avatarPreview = '';
	};

	const resetForm = () => {
		if (activePersonId) {
			const current = people.find((p) => p.id === activePersonId);
			personForm = current ? mapFromPerson(current) : createEmptyPersonForm();
		} else {
			personForm = createEmptyPersonForm();
		}
		avatarPreview = '';
	};

	const resetAvatar = () => {
    personForm = {...personForm, avatarPath: "", avatar: null}
		avatarPreview = activePerson?.avatarPath ?? "";
  }

	const removePersonFromClassrooms = async (personId: string) => {
		for (const classroom of classrooms) {
			const currentActive = new Set(classroom.peopleIds);
			const currentGuests = new Set(classroom.guestIds);
			const changed = currentActive.delete(personId) || currentGuests.delete(personId);
			if (changed) {
				await classroom.updateRecord({
					people: Array.from(currentActive),
					guests: Array.from(currentGuests)
				});
			}
		}
		classrooms = [...classrooms];
	};

	const handleSave = async (e: Event) => {
		e.preventDefault();
    const isNew = !activePerson;
    let partial: Partial<PersonPB> = {};
    let newPerson: Person;
    let newAvatar: File | null = null;
		try {
			const configCopy = JSON.parse(JSON.stringify(personForm.config));
			if (!activePerson) {
				partial = {
					name: personForm.name,
					role: personForm.role,
					title: personForm.title,
					pronoun: personForm.pronoun === 'they' ? undefined : personForm.pronoun ?? undefined,
					config: configCopy
				};
				newPerson = await SchoolBuilder.createPerson(partial);
				newAvatar = personForm.avatar || null;
			} else {
				const activeConfig = mergeConfig(activePerson.config);
				const formPronoun =
					personForm.pronoun === 'they' ? undefined : personForm.pronoun ?? undefined;
				const activePronoun =
					activePerson.pronoun === 'they'
						? undefined
						: (activePerson.pronoun as 'he' | 'she' | undefined);

				if (personForm.name !== activePerson.name) partial.name = personForm.name;
				if (personForm.role !== activePerson.role) partial.role = personForm.role;
				if ((personForm.title || '') !== (activePerson.title || '')) partial.title = personForm.title;
				if (formPronoun !== activePronoun) partial.pronoun = formPronoun;
				if (JSON.stringify(personForm.config) !== JSON.stringify(activeConfig)) {
					partial.config = configCopy;
				}
				if (personForm.avatar || avatarPreview !== activePerson.avatarPath) {
					newAvatar = personForm.avatar ?? null;
				}
				await activePerson.updateRecord(partial);
				newPerson = activePerson;
			}

			if (newAvatar) await newPerson.updateAvatar(newAvatar);

			let next = [...people].filter((p) => p.id !== newPerson.id);
			people = [...next];
			setTimeout(
				() => (people = [newPerson, ...next].toSorted((a, b) => a.name.localeCompare(b.name))),
				10
			);
			activePersonId = newPerson.id;
			activePerson = newPerson;
			avatarPreview = activePerson.avatarPath;

			toaster.success({
				title: `Success! ${personForm.name} ${isNew ? 'created' : 'updated'}.`,
			});
		} catch (error) {
			console.error(error);
			toaster.error({
				title: `Error: ${personForm.name} failed to ${isNew ? 'save' : 'update'}.`,
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};

	const handleDelete = async (e: Event) => {
		e.preventDefault();
		if (!activePersonId) return;
		const personIndex = people.findIndex((person) => person.id === activePersonId);
		if (personIndex === -1) return;
		try {
			const deletedPerson = people.splice(personIndex, 1)?.[0];
			await removePersonFromClassrooms(deletedPerson.id);
			await deletedPerson.deleteRecord();
			toaster.success({
				title: 'Person deleted',
				description: deletedPerson.name || undefined
			});
		} catch (error) {
			console.error(error);
			toaster.error({
				title: 'Delete failed',
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};

	const setAvatarFile = (file: File | null) => {
		personForm.avatar = file ?? null;
		avatarPreview = file ? URL.createObjectURL(file) : '';
	};

	const handleAvatarAccept = (files: File[]) => {
		setAvatarFile(files?.[0] ?? null);
	};

	const setPronoun = (value: 'he' | 'she') => {
		personForm.pronoun = personForm.pronoun === value ? null : value;
	};

</script>

<div class=" p-4">
	<div class="mx-auto flex max-w-6xl flex-col gap-4">
		<header class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
			<div class="space-y-1">
				<p class="text-sm uppercase tracking-wide text-surface-700-300">People</p>
				<h1 class="text-2xl font-bold">Edit & Add People</h1>
				<p class="text-sm text-surface-700-300">
					Select someone to edit their details, or start a new person. Wiring to PocketBase will be added later.
				</p>
			</div>
		</header>

		{#if loadError}
			<div class="card border border-error-500 bg-error-50-950/60 p-4">
				<p class="font-semibold text-error-500">Could not load people</p>
				<p class="text-sm text-error-500/90">{loadError}</p>
			</div>
		{:else}
			<div class="grid gap-4 lg:grid-cols-[360px_1fr]">
				<!-- People list -->
				<section class="flex h-full flex-col gap-3 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
					<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 items-center gap-2">
						<div class="relative col-span-2 ">
							<SearchIcon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500-400" />
							<input
								type="search"
								placeholder="Filter by name"
								class="input w-full rounded-full bg-surface-50-950 pl-10"
								bind:value={searchTerm}
							/>
						</div>
						<select
							class="select  rounded-full"
							bind:value={roleFilter}
						>
							<option value="all">All</option>
							<option value="student">Students</option>
							<option value="teacher">Teachers</option>
						</select>

			<button
				type="button"
				onclick={startNewPerson}
				class="btn preset-filled-primary-500 flex items-center gap-2 rounded-full "
			>
				<PlusIcon class="size-4 " />
				New Person
			</button>
					</div>

					<div class="max-h-[70vh] space-y-2 overflow-auto pr-1">
						{#if !visiblePeople.length}
							<p class="text-sm italic text-surface-700-300">No people match this filter.</p>
						{:else}
							{#each visiblePeople as person}
								<button
									type="button"
									onclick={() => selectPerson(person.id)}
									class={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
										person.id === activePersonId
											? 'border-primary-400-600 bg-primary-100-900/50'
											: 'border-surface-200-800 hover:border-primary-200 hover:bg-surface-50-950'
									}`}
								>
									<Avatar class="h-12 w-12 shrink-0 bg-surface-200-800">
											<Avatar.Image
												src={person.avatarPath}
												alt={person.name}
												class="h-full w-full object-contain"
											/>
											<Avatar.Fallback class="text-sm font-semibold text-surface-500-400">
												{person.name?.slice(0, 2)?.toUpperCase() ?? '?'}
											</Avatar.Fallback>
									</Avatar>
									<div class="flex flex-1 flex-col">
                    <span class="flex items-end p-0 gap-1">

											{#if person.title}
												<span class=" text-xs leading-5 text-surface-700-300">{person.title}</span>
											{/if}

                      <p class="font-semibold leading-5">{person.name}</p>
                    </span>
										{#if person.pronoun}
											<p class="text-xs text-surface-600-400">
												{person.pronoun === 'he'
													? 'he/him'
													: person.pronoun === 'she'
														? 'she/her'
														: 'they/them'}
											</p>
										{/if}
									</div>
									<div class="text-right text-xs text-surface-600-400">
                    <p>{getActiveClassroomCount(person.id)} classrooms</p>
										<p class="text-xs text-surface-700-300 flex items-center justify-end gap-2">
											<span class="rounded-full bg-surface-50-950 px-2 py-0.5">
												{person.role === 'teacher' ? 'Teacher' : 'Student'}
											</span>
										</p>
									</div>
								</button>
							{/each}
						{/if}
					</div>
				</section>

				<!-- Person form -->
				<section class="flex flex-col gap-4 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
					<div class="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200-800 pb-3">
						<div>
							<p class="text-xs uppercase tracking-wide text-surface-700-300">
								{activePersonId ? 'Editing existing person' : 'Creating new person'}
							</p>
							<h2 class="text-xl font-semibold">
								{personForm.name || 'Untitled person'}
							</h2>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<button type="button" class="btn preset-filled-success-500 flex items-center gap-2 rounded-full px-3" onclick={handleSave}>
								<SaveIcon class="size-4" />
								{personForm.id ? "Update" : "Save"}
							</button>
							<button type="button" class="btn preset-outlined-warning-500 flex items-center gap-2 rounded-full px-3" onclick={resetForm}>
								<RefreshCcwIcon class="size-4" />
								{personForm.id ? "Reset" : "Clear"}
							</button>
							<button type="button" class="btn preset-outlined-error-500 flex items-center gap-2 rounded-full px-3" onclick={handleDelete} disabled={!activePersonId}>
								<Trash2Icon class="size-4" />
                Delete
							</button>
						</div>
					</div>

					<form class="space-y-4" onsubmit={handleSave}>
						<div class="grid gap-4 md:grid-cols-[200px_1fr]">
							<div class="flex flex-col items-center gap-3 rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4">
								<label class="text-sm font-semibold" for="person-avatar">
                  {#if personForm.avatar}
                  <button type="button" onclick={resetAvatar} class="btn preset-filled-warning-500 rounded-full p-1">
                    <RefreshCcwIcon class="size-2" />
                  </button>
                  {/if}
                  Avatar
                </label>
								<FileUpload
									class="flex flex-col items-center gap-2"
									accept={{ 'image/*': [] }}
									maxFiles={1}
									ids={{ hiddenInput: 'person-avatar' }}
									onFileAccept={({ files }) => handleAvatarAccept(files)}
								>
									<FileUpload.Dropzone class="group flex items-center justify-center p-0! border-none! bg-transparent!">
										<Avatar class="h-32 w-32 overflow-hidden rounded-full border border-dashed border-surface-200-800 bg-surface-100-900 transition group-data-[dragging=true]:border-primary-500 group-data-[dragging=true]:bg-primary-50-950/60">
											{#if avatarPreview}
												<Avatar.Image
													src={avatarPreview}
													alt="New avatar preview"
													class="h-full w-full object-contain"
												/>
											{:else if personForm.avatarPath}
												<Avatar.Image
													src={personForm.avatarPath}
													alt="Current avatar"
													class="h-full w-full object-contain"
												/>
											{:else}
												<Avatar.Fallback class="text-sm text-surface-700-300">
													Click to Upload
												</Avatar.Fallback>
											{/if}
										</Avatar>
										<FileUpload.HiddenInput accept="image/*" />
									</FileUpload.Dropzone>
								</FileUpload>
								{#if personForm.id}
									<code class="truncate text-[10px] text-surface-700-300">{personForm.id}</code>
								{/if}
							</div>

							<div class="grid gap-3 sm:grid-cols-2">

								<div class="space-y-1 sm:col-span-2">
									<span class="text-sm font-semibold">Role</span>
									<div class="grid grid-cols-2 gap-2">
										<button
											type="button"
											class={`btn rounded-full ${personForm.role === 'student'
												? 'preset-filled-primary-500'
												: 'preset-outlined-surface-200-800'}`}
											onclick={() => (personForm.role = 'student')}
										>
											Student
										</button>
										<button
											type="button"
											class={`btn rounded-full ${personForm.role === 'teacher'
												? 'preset-filled-primary-500'
												: 'preset-outlined-surface-200-800'}`}
											onclick={() => (personForm.role = 'teacher')}
										>
											Teacher
										</button>
									</div>
								</div>

                {#if personForm.role == "teacher"}
                  <label class="space-y-1 ">
                    <span class="text-sm font-semibold">Title</span>
                    <input
                      class="input w-full rounded-full"
                      type="text"
                      placeholder="Ms., Mr., Coach..."
                      bind:value={personForm.title}
                    />
                  </label>
                {/if}

								<label class={`space-y-1 ${personForm.role == "teacher" || "sm:col-span-2"}`}>
									<span class="text-sm font-semibold">Name</span>
									<input
										class="input w-full rounded-full"
										type="text"
										bind:value={personForm.name}
										required
									/>
								</label>

								<div class="space-y-1 sm:col-span-2">
									<span class="text-sm font-semibold">Pronoun</span>
									<div class="grid grid-cols-2 gap-2">
										<button
											type="button"
											class={`btn rounded-full  ${personForm.pronoun === 'he'
												? 'preset-outlined-surface-200-800 bg-blue-300'
												: 'border-2 border-blue-300'}`}
											onclick={() => setPronoun('he')}
										>
											He / him
										</button>
										<button
											type="button"
											class={`btn rounded-full  ${personForm.pronoun === 'she'
												? 'preset-outlined-surface-200-800 bg-pink-300'
												: 'border-2 border-pink-300'}`}
											onclick={() => setPronoun('she')}
										>
											She / her
										</button>
									</div>
								</div>

							</div>
						</div>

							<PersonConfigPanel
                title="Settings"
                subtitle={`The defaults for ${personForm.name || "the person"}'s interactions.`}
								config={personForm.config}
								imageAssets={emotions}
								onConfigChange={(next: FilledConfig) =>
									(personForm = { ...personForm, config: next })}
							/>
					</form>
				</section>
			</div>
		{/if}
	</div>
</div>
