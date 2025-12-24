<script lang="ts">
	import type { PageData } from './$types';
	import type { ClassroomPB } from '$lib/pb/schema/index';
	import { Classroom, Person, SchoolBuilder } from '$lib/pb';
	import ClassroomConfigPanel, { type ClassroomConfig } from '$lib/config/Classroom.svelte';
	import {
		ContactRound,
		EyeIcon,
		EyeOffIcon,
		MapPinIcon,
		PlusIcon,
		RefreshCcwIcon,
		SaveIcon,
		SearchIcon,
		Trash2Icon,
		UserIcon
	} from '@lucide/svelte';
	import { Avatar, Switch } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster';

	type ClassroomForm = {
		id?: string;
		name: string;
		location: string;
		hidden: boolean;
		peopleIds: string[];
		guestIds: string[];
		configText: string;
	};

	let { data }: { data: PageData } = $props();

	let loadError = $state(data.loadError ?? '');
	let classrooms = $state<Classroom[]>(data.classrooms ?? []);
	let people = $state<Person[]>(data.people ?? []);
	let imageAssets = $state(data.imageAssets ?? []);
	let searchTerm = $state('');
	let memberSearch = $state('');
	let roleFilter = $state<'all' | 'student' | 'teacher'>('all');
	let activeClassroomId = $state<string | null>(null);
	let activeClassroom = $state<Classroom | null>(null);
	let classroomForm = $state<ClassroomForm>(createEmptyForm());
	let formError = $state('');
	let parsedConfig = $state<ClassroomConfig>({});
	let configParseError = $state('');
	function createEmptyForm(): ClassroomForm {
		return {
			name: '',
			location: '',
			hidden: false,
			peopleIds: [],
			guestIds: [],
			configText: '{\n}'
		};
	}

	const mapFromClassroom = (classroom: Classroom): ClassroomForm => ({
		id: classroom.id,
		name: classroom.name ?? '',
		location: classroom.record.location ?? '',
		hidden: classroom.record.hidden ?? false,
		peopleIds: classroom.peopleIds,
		guestIds: classroom.guestIds,
		configText: JSON.stringify(classroom.config ?? {}, null, 2)
	});

	const visibleClassrooms = $derived.by(() => {
		let next = classrooms;
		if (searchTerm.trim()) {
			const q = searchTerm.trim().toLowerCase();
			next = next.filter(
				(c) => c.name.toLowerCase().includes(q) || (c.record.location || '').toLowerCase().includes(q)
			);
		}
		return next.toSorted((a, b) => a.name.localeCompare(b.name));
	});

	const setsEqual = (a: Set<string>, b: Set<string>) => {
		if (a.size !== b.size) return false;
		for (const item of a) {
			if (!b.has(item)) return false;
		}
		return true;
	};

	const filteredPeople = $derived.by(() => {
		let next = people;
		if (roleFilter !== 'all') next = next.filter((p) => p.role === roleFilter);
		if (memberSearch.trim()) {
			const q = memberSearch.trim().toLowerCase();
			next = next.filter((p) => p.name.toLowerCase().includes(q));
		}
		return next.toSorted((a, b) => a.name.localeCompare(b.name));
	});

	const toggleMember = (personId: string, target: 'people' | 'guests') => {
		const nextActive = new Set(classroomForm.peopleIds);
		const nextGuests = new Set(classroomForm.guestIds);
		const wasActive = nextActive.has(personId);
		const wasGuest = nextGuests.has(personId);

		// Always start by removing to keep exclusivity
		nextActive.delete(personId);
		nextGuests.delete(personId);

		// If the user clicked the same state that was already set, leave them removed (true toggle off)
		const isSameToggle =
			(target === 'people' && wasActive) || (target === 'guests' && wasGuest);
		if (!isSameToggle) {
			if (target === 'people') nextActive.add(personId);
			if (target === 'guests') nextGuests.add(personId);
		}

		classroomForm = {
			...classroomForm,
			peopleIds: Array.from(nextActive),
			guestIds: Array.from(nextGuests)
		};
	};

	$effect(() => {
		try {
			parsedConfig = classroomForm.configText.trim()
				? JSON.parse(classroomForm.configText)
				: {};
			configParseError = '';
		} catch (error) {
			parsedConfig = {};
			configParseError = 'Config JSON is invalid. Fix it below or reset the form.';
		}
	});

	$effect(() => {
		if (activeClassroomId) {
			const current = classrooms.find((c) => c.id === activeClassroomId);
			if (current) {
				activeClassroom = current;
				classroomForm = mapFromClassroom(current);
			} else {
				activeClassroomId = null;
				activeClassroom = null;
				classroomForm = createEmptyForm();
			}
		} else {
			activeClassroom = null;
			classroomForm = createEmptyForm();
		}
		formError = '';
	});

	const selectClassroom = (id: string) => {
		activeClassroomId = id;
	};

	const startNewClassroom = () => {
		activeClassroomId = null;
		activeClassroom = null;
		classroomForm = createEmptyForm();
		formError = '';
	};

	const resetForm = () => {
		formError = '';
		if (activeClassroom) {
			classroomForm = mapFromClassroom(activeClassroom);
		} else {
			classroomForm = createEmptyForm();
		}
	};

	const parseConfig = () => {
		if (!classroomForm.configText.trim()) return {};
		try {
			const parsed = JSON.parse(classroomForm.configText);
			if (typeof parsed !== 'object' || parsed === null) {
				throw new Error('Config must be an object');
			}
			return parsed;
		} catch (error) {
			formError = error instanceof Error ? error.message : 'Invalid config JSON';
			throw error;
		}
	};

	const handleConfigChange = (nextConfig: ClassroomConfig) => {
		formError = '';
		classroomForm = {
			...classroomForm,
			configText: JSON.stringify(nextConfig ?? {}, null, 2)
		};
	};

	const handleSave = async (event: Event) => {
		event.preventDefault();
		formError = '';
		if (!classroomForm.name.trim()) {
			formError = 'Name is required.';
			return;
		}

		let parsedConfig: Record<string, any> = {};
		try {
			parsedConfig = parseConfig();
		} catch {
			return;
		}

		try {
			const isNew = !activeClassroom;
			const baseData: Partial<ClassroomPB> = {
				name: classroomForm.name.trim(),
				location: classroomForm.location.trim() || undefined,
				hidden: classroomForm.hidden,
				config: parsedConfig,
				people: classroomForm.peopleIds,
				guests: classroomForm.guestIds
			};

			let updatedClassroom: Classroom;

			if (!activeClassroom) {
				updatedClassroom = await SchoolBuilder.createClassroom({
					...baseData,
					people: baseData.people ?? [],
					guests: baseData.guests ?? []
				});
			} else {
				const partial: Partial<ClassroomPB> = {};
				const trimmedLocation = baseData.location ?? '';
				if (classroomForm.name.trim() !== activeClassroom.name) partial.name = baseData.name;
				if ((trimmedLocation || '') !== (activeClassroom.record.location || '')) partial.location = trimmedLocation;
				if (classroomForm.hidden !== (activeClassroom.record.hidden || false))
					partial.hidden = classroomForm.hidden;

				const currentConfig = JSON.stringify(activeClassroom.config ?? {});
				const nextConfig = JSON.stringify(parsedConfig ?? {});
				if (currentConfig !== nextConfig) partial.config = parsedConfig;

				const currentActive = new Set(activeClassroom.peopleIds);
				const currentGuests = new Set(activeClassroom.guestIds);
				const nextActive = new Set(baseData.people ?? []);
				const nextGuests = new Set(baseData.guests ?? []);
				if (!setsEqual(currentActive, nextActive)) {
					partial.people = Array.from(nextActive);
				}
				if (!setsEqual(currentGuests, nextGuests)) {
					partial.guests = Array.from(nextGuests);
				}

				if (Object.keys(partial).length) {
					await activeClassroom.updateRecord(partial);
				}
				updatedClassroom = activeClassroom;
			}

			const next = classrooms.filter((c) => c.id !== updatedClassroom.id);
			classrooms = [...next, updatedClassroom].toSorted((a, b) => a.name.localeCompare(b.name));
			activeClassroomId = updatedClassroom.id;
			activeClassroom = updatedClassroom;
			classroomForm = mapFromClassroom(updatedClassroom);

			toaster.success({
				title: isNew ? 'Classroom created' : 'Classroom updated',
				description: classroomForm.name || undefined
			});
		} catch (error) {
			console.error(error);
			formError = error instanceof Error ? error.message : 'Save failed.';
			toaster.error({
				title: 'Save failed',
				description: formError
			});
		}
	};

	const handleDelete = async (event: Event) => {
		event.preventDefault();
		formError = '';
		if (!activeClassroom) return;
		try {
			const name = activeClassroom.name;
			await activeClassroom.deleteRecord();
			classrooms = classrooms.filter((c) => c.id !== activeClassroom?.id);
			startNewClassroom();
			toaster.success({
				title: 'Classroom deleted',
				description: name || undefined
			});
		} catch (error) {
			console.error(error);
			formError = error instanceof Error ? error.message : 'Delete failed.';
			toaster.error({
				title: 'Delete failed',
				description: formError
			});
		}
	};
</script>

<div class="p-4">
	<div class="mx-auto flex max-w-6xl flex-col gap-4">
		<header class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
			<div class="space-y-1">
				<p class="text-sm uppercase tracking-wide text-surface-700-300">Classrooms</p>
				<h1 class="text-2xl font-bold">Manage Classrooms</h1>
				<p class="text-sm text-surface-700-300">
					Add or edit classroom details, hide rooms, and store optional config JSON.
				</p>
			</div>
			<button
				type="button"
				onclick={startNewClassroom}
				class="btn preset-filled-primary-500 flex items-center gap-2 rounded-full px-4"
			>
				<PlusIcon class="size-4" />
				New Classroom
			</button>
		</header>

		{#if loadError}
			<div class="card border border-error-500 bg-error-50-950/60 p-4">
				<p class="font-semibold text-error-500">Could not load classrooms</p>
				<p class="text-sm text-error-500/90">{loadError}</p>
			</div>
		{:else}
			<div class="grid gap-4 lg:grid-cols-[360px_1fr]">
				<section class="flex h-full flex-col gap-3 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
					<div class="grid grid-cols-[1fr_auto] items-center gap-2">
						<div class="relative">
							<SearchIcon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500-400" />
							<input
								type="search"
								placeholder="Filter by name or location"
								class="input w-full rounded-full bg-surface-50-950 pl-10"
								bind:value={searchTerm}
							/>
						</div>
						<button
							type="button"
							onclick={startNewClassroom}
							class="btn preset-filled-primary-500 flex items-center gap-2 rounded-full px-3"
						>
							<PlusIcon class="size-4" />
							New
						</button>
					</div>

					<div class="max-h-[70vh] space-y-2 overflow-auto pr-1">
						{#if !visibleClassrooms.length}
							<p class="text-sm italic text-surface-700-300">No classrooms match this filter.</p>
						{:else}
							{#each visibleClassrooms as classroom}
								<button
									type="button"
									onclick={() => selectClassroom(classroom.id)}
									class={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
										classroom.id === activeClassroomId
											? 'border-primary-400-600 bg-primary-100-900/50'
											: 'border-surface-200-800 hover:border-primary-200 hover:bg-surface-50-950'
									}`}
								>
									<div class="flex flex-1 flex-col">
										<p class="font-semibold leading-5">{classroom.name}</p>
										{#if classroom.record.location}
											<span class="flex items-center gap-1 text-xs text-surface-600-400">
												<MapPinIcon class="size-3" />
												{classroom.record.location}
											</span>
										{/if}
									</div>
									<span class="flex items-center gap-2 text-xs text-surface-700-300">
										<span class="rounded-full bg-surface-50-950 px-2 py-0.5">
											{classroom.peopleIds.length} people
										</span>
										<span class="rounded-full bg-surface-50-950 px-2 py-0.5">
											{classroom.guestIds.length} guests
										</span>
										{#if classroom.record.hidden}
											<span class="rounded-full bg-surface-50-950 px-2 py-0.5 inline-flex items-center gap-1">
												<EyeOffIcon class="size-3" />
												Hidden
											</span>
										{:else}
											<span class="rounded-full bg-surface-50-950 px-2 py-0.5 inline-flex items-center gap-1">
												<EyeIcon class="size-3" />
												Visible
											</span>
										{/if}
									</span>
								</button>
							{/each}
						{/if}
					</div>
				</section>

				<section class="flex flex-col gap-4 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
					<div class="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200-800 pb-3">
						<div>
							<p class="text-xs uppercase tracking-wide text-surface-700-300">
								{activeClassroomId ? 'Editing classroom' : 'Creating new classroom'}
							</p>
							<h2 class="text-xl font-semibold">
								{classroomForm.name || 'Untitled classroom'}
							</h2>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<button type="button" class="btn preset-filled-success-500 flex items-center gap-2 rounded-full px-3" onclick={handleSave}>
								<SaveIcon class="size-4" />
								Save
							</button>
							<button type="button" class="btn preset-outlined-warning-500 flex items-center gap-2 rounded-full px-3" onclick={resetForm}>
								<RefreshCcwIcon class="size-4" />
								Reset
							</button>
							<button type="button" class="btn preset-outlined-error-500 flex items-center gap-2 rounded-full px-3" onclick={handleDelete} disabled={!activeClassroomId}>
								<Trash2Icon class="size-4" />
								Delete
							</button>
						</div>
					</div>

					{#if formError}
						<div class="rounded-xl border border-error-500 bg-error-50-950/70 px-3 py-2 text-sm text-error-600">
							{formError}
						</div>
					{/if}

					<form class="space-y-4" onsubmit={handleSave}>
						<div class="grid gap-4 ">

							<div class="grid gap-3  sm:grid-cols-2">
								<label class="space-y-1 sm:col-span-2">
									<span class="text-sm font-semibold">Name</span>
									<input
										class="input w-full rounded-full"
										type="text"
										bind:value={classroomForm.name}
										required
									/>
								</label>


								<label class="space-y-1 ">
									<span class="text-sm font-semibold">Visibility</span>
                  <Switch
                    class="flex items-center justify-between gap-3 rounded-xl border border-surface-200-800 bg-surface-100-900 px-3 py-2"
                    checked={classroomForm.hidden}
                    onCheckedChange={({ checked }) => (classroomForm.hidden = checked)}
                  >
                    <Switch.Label class="flex items-center gap-2 text-sm">
                      {#if classroomForm.hidden}
                        <EyeOffIcon class="size-4 text-warning-500" />
                        Hidden
                      {:else}
                        <EyeIcon class="size-4 text-success-500" />
                        Visible
                      {/if}
                    </Switch.Label>
                    <Switch.Control class="preset-tonal data-[state=checked]:preset-filled-warning-500">
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.HiddenInput />
                  </Switch>
                </label>

								<label class="space-y-1 ">
									<span class="text-sm font-semibold">Location</span>
									<div class="relative">
										<MapPinIcon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500-400" />
										<input
											class="input w-full rounded-full pl-10"
											type="text"
											placeholder="Optional"
											bind:value={classroomForm.location}
										/>
									</div>
								</label>
							</div>
						</div>

						<div class="rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4 space-y-3">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<div>
									<h3 class="text-lg font-semibold">Class Roster</h3>
									<p class="text-xs text-surface-700-300">Assign people as active or guest in this classroom.</p>
								</div>
								<div class="flex items-center gap-2">
									<div class="relative flex-3  ">
										<SearchIcon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500-400" />
										<input
											type="search"
											class="input w-full rounded-full bg-surface-100-900 pl-10"
											placeholder="Search people"
											bind:value={memberSearch}
										/>
									</div>
									<select class="select rounded-full flex-1" bind:value={roleFilter}>
										<option value="all">All</option>
										<option value="student">Students</option>
										<option value="teacher">Teachers</option>
									</select>
								</div>
							</div>

							<div class="grid gap-2 sm:grid-cols-2">
								{#each filteredPeople as person}
									<div class="flex items-center justify-between rounded-xl border border-surface-200-800 bg-surface-100-900 px-3 py-2">
										<div class="flex items-center gap-3">
											<Avatar class="size-10 shrink-0 bg-surface-200-800">
												<Avatar.Image
													src={person.avatarPath}
													alt={person.name}
													class="h-full w-full object-contain"
												/>
												<Avatar.Fallback class="text-sm font-semibold text-surface-500-400">
													{person.name?.slice(0, 2)?.toUpperCase() ?? '?'}
												</Avatar.Fallback>
											</Avatar>
											<div>
												<p class="font-medium">{person.name}</p>
												<p class="text-xs text-surface-700-300 capitalize">{person.role}</p>
											</div>
										</div>
										<div class="flex gap-2">
											<button
												type="button"
												class={`btn size-10 p-0 flex items-center justify-center rounded-full text-sm ${
													classroomForm.peopleIds.includes(person.id)
														? 'preset-filled-success-500'
														: 'preset-outlined-surface-200-800'
												}`}
												onclick={() => toggleMember(person.id, 'people')}
											>
												<UserIcon />
											</button>
											<button
												type="button"
												class={`btn size-10 p-0 flex items-center justify-center rounded-full text-sm ${
													classroomForm.guestIds.includes(person.id)
														? 'preset-filled-warning-500'
														: 'preset-outlined-warning-200-800'
												}`}
												onclick={() => toggleMember(person.id, 'guests')}
											>
												<ContactRound />
											</button>
										</div>
									</div>
								{/each}
								{#if !filteredPeople.length}
									<p class="text-sm italic text-surface-700-300 sm:col-span-2">No people match this filter.</p>
								{/if}
							</div>
						</div>

						<ClassroomConfigPanel
							config={parsedConfig}
              {imageAssets}
							onConfigChange={handleConfigChange}
						/>
						{#if configParseError}
							<p class="text-xs text-error-500">{configParseError}</p>
						{/if}

					</form>
				</section>
			</div>
		{/if}
	</div>
</div>
