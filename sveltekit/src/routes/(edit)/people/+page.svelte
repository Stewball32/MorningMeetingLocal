<script lang="ts">
	import type { PageData } from './$types';
	import { Tabs, Switch, Segment } from '@skeletonlabs/skeleton-svelte';
	import { FileUpload, type FileUploadApi } from '@skeletonlabs/skeleton-svelte';
	import { Classroom, Person } from '$lib/pb/objects';
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
	import IconActivePerson from '@lucide/svelte/icons/user';
	import IconGuestPerson from '@lucide/svelte/icons/user-pen';
	import IconClassroom from '@lucide/svelte/icons/school';

	import type { ComponentProps } from 'svelte';
	import { AppleIcon } from '@lucide/svelte';
	import type { PersonConfig } from '$lib/pb/schema';

	let { data }: { data: PageData } = $props();
	let people = $state(data.people);
	let classrooms = data.classrooms;
	let currentPerson = $state<Person | null>(people[0]);

	let tab = $state('all');
	let filteredPeople = $state(people);

	let avatarApi: FileUploadApi;
	let newAvatarUrl = $state<string>('');
	let newAvatarFile: File | null | undefined = undefined;

	let defaultConfig: Required<PersonConfig> = {
		emotions: [],
		poll: {
			num: {
				type: 'multi',
				options: 4
			},
			str: {
				type: 'multi',
				options: 4
			}
		},
		quiz: {
			num: {
				type: 'multi',
				options: 4
			},
			str: {
				type: 'multi',
				options: 4
			}
		},
		rating: {
			type: 'smileys',
			options: 3
		},
		video: {
			id: '',
			start: 0,
			end: 0
		}
	};

	let currentFormPerson = $state<{
		avatarUrl?: string;
		name?: string;
		role?: 'student' | 'teacher';
		title?: string;
		classrooms?: string[];
		guestrooms?: string[];
		pronoun?: string;
	}>({});

	let currentFormConfig = $state(defaultConfig);
	let vidIdInput = $state<string>('elk5PpYyF-M');
	let vidStartMin = $state<number>(0);
	let vidStartSec = $state<number>(46);
	let vidDurationSec = $state<number>(14);
	const vidParams = '?rel=0&showinfo=0&modestbranding=1';
	let vidPreviewUrl = $state<string>(
		// svelte-ignore state_referenced_locally
		`https://www.youtube.com/embed/${vidIdInput}${vidParams}&start=${vidStartMin ** 60 + vidStartSec}&end=${vidStartMin ** 60 + vidStartSec + vidDurationSec}`
	);

	const updateVidForm = (video: { id?: string; start?: number; end?: number }) => {
		console.log(video);
		vidIdInput = video?.id ?? '';
		const s = Math.max(0, Math.floor(video?.start ?? 0));
		const e = Math.max(0, Math.floor(video?.end ?? 0));
		[vidStartMin, vidStartSec] = [Math.floor(s / 60), s % 60];
		vidDurationSec = e - s;
	};

	const generateVideoPreview = () => {
		let newVidId = vidIdInput
			.replace('https://', '')
			.replace('http://', '')
			.replace('www.', '')
			.replace('youtube.com/', '')
			.replace('youtu.be/', '')
			.replace('watch?v=', '')
			.split('?')[0];
		const vidStart = vidStartMin ** 60 + (vidStartSec ?? 0);
		const vidEnd = (vidStart ?? 0) + vidDurationSec;
		vidPreviewUrl = `https://www.youtube.com/embed/${newVidId}?rel=0&showinfo=0&modestbranding=1&start=${vidStart}&end=${vidEnd}`;
	};

	$effect(() => {
		if (currentPerson) {
			currentFormPerson = {
				avatarUrl: currentPerson.avatarUrl ?? '',
				name: currentPerson.name ?? '',
				role: currentPerson.role ?? 'student',
				title: currentPerson.title ?? '',
				classrooms: currentPerson.classroomIds ?? [],
				guestrooms: currentPerson.guestroomIds ?? [],
				pronoun: currentPerson.pronoun ?? ''
			};
			currentFormConfig = currentPerson.config;
			newAvatarUrl = '';
		} else {
			currentFormPerson = {};
			currentFormConfig = defaultConfig;
		}
		// updateVidForm(currentFormConfig.video);
		generateVideoPreview();
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
		if (!currentFormPerson) return;
		if (!pronoun) return (currentFormPerson.pronoun = '');
		currentFormPerson.pronoun = currentFormPerson.pronoun === pronoun ? '' : pronoun;
	};

	const savePerson = () => {
		console.log('savePerson', currentFormPerson);
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
</script>

<div class="flex h-full flex-col justify-around gap-1 px-1 xl:flex-row xl:justify-evenly">
	<Tabs
		value={tab}
		onValueChange={updateFilteredPeople}
		base="flex h-full min-h-0 flex-col"
		classes="table-wrap max-h-2/5 w-full xl:h-full xl:w-6/12"
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
							<td>{person.classroomIds.length}</td>
							<td class="!text-right text-xs">
								{person.id}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/snippet}
	</Tabs>

	<div
		class="card grid h-auto w-full grid-cols-1 gap-2 overflow-y-auto overflow-x-hidden p-4 xl:h-full xl:w-3/4 xl:grid-cols-2"
	>
		<span class="h1 m-0 w-full text-center xl:col-span-2">
			Editing: {currentPerson?.name ?? 'New Person'}
		</span>
		<!-- Person's Info -->
		<form
			class="bg-surface-200-800/70 grid w-full grid-cols-5 items-center rounded-2xl p-2"
			onsubmit={savePerson}
		>
			<div class="col-span-5 grid w-full grid-cols-4 justify-between gap-x-3 px-4">
				<span class="h3 col-span-2 m-0 text-center"> Info </span>
				<button type="submit" class="btn preset-filled-success-500 rounded-full border">
					Update
				</button>
				<button
					type="button"
					class="btn preset-filled-secondary-500 rounded-full border"
					onclick={resetForm}
				>
					Reset
				</button>
			</div>
			<div class="col-span-2 flex flex-col items-center justify-between gap-2">
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
					classes="size-32 rounded-full overflow-hidden outline-2 grid place-items-center"
				>
					<img
						class="max-h-32 max-w-32 object-center"
						src={newAvatarUrl || currentPerson?.avatarUrl}
						alt="avatar"
						loading="lazy"
					/>
				</FileUpload>

				<code class="truncate text-xs opacity-70">
					{#if currentPerson?.id}
						{currentPerson.id}
					{/if}
				</code>
			</div>
			<div class="col-span-3 grid grid-cols-2 gap-2">
				<div class="col-span-3">
					<div class="col-span-2">
						<label
							for="person-name-input"
							class={'label w-full text-center font-bold ' +
								(currentPerson?.name === currentFormPerson?.name ? 'font-bold' : 'italic')}
						>
							Name*
						</label>
						<input
							id="person-name-input"
							class={'input w-full rounded-full placeholder:font-normal placeholder:italic placeholder:opacity-30'}
							type="text"
							placeholder={currentPerson?.name || 'Name'}
							bind:value={currentFormPerson.name}
							required
						/>
					</div>
					<label
						for="person-title-input"
						class={'label w-full text-center ' +
							(currentPerson?.role === currentFormPerson?.role ? 'font-bold' : 'italic')}
					>
						Role
					</label>
					<div id="person-title-input" class="grid w-full grid-cols-2 gap-3">
						<button
							onclick={(e) => {
								e.preventDefault();
								if (currentFormPerson) currentFormPerson.role = 'student';
							}}
							class={'btn preset-outlined-surface-200-800 rounded-full ' +
								(currentFormPerson.role === 'student' ? 'bg-surface-50-950 border-2' : '')}
						>
							Student
						</button>
						<button
							onclick={(e) => {
								e.preventDefault();
								if (currentFormPerson) currentFormPerson.role = 'teacher';
							}}
							class={'btn preset-outlined-surface-200-800 rounded-full ' +
								(currentFormPerson.role === 'teacher' ? 'bg-surface-50-950 border-2' : '')}
						>
							Teacher
						</button>
					</div>
				</div>
				<div class="col-span-1">
					<label
						for="person-title-input"
						class={'label w-full text-center ' +
							(currentPerson?.title === currentFormPerson?.title ? 'font-bold' : 'italic')}
					>
						Title
					</label>
					<input
						id="person-title-input"
						type="text"
						disabled={currentFormPerson?.role === 'student'}
						placeholder={currentFormPerson?.role !== 'student'
							? currentPerson?.title || 'Title'
							: 'N/A'}
						class={'input w-full rounded-full placeholder:font-normal placeholder:italic placeholder:opacity-30 '}
						bind:value={currentFormPerson.title}
					/>
				</div>
				<div class="col-span-1">
					<label
						for="pronoun-select"
						class={'label w-full text-center ' +
							(currentPerson?.pronoun === currentFormPerson?.pronoun ? 'font-bold' : 'italic')}
					>
						Pronoun
					</label>
					<div id="person-title-input" class="grid w-full grid-cols-2 gap-3">
						<button
							onclick={(e) => {
								e.preventDefault();
								updatePronoun('he');
							}}
							class={'btn rounded-full border border-blue-300 ' +
								(currentFormPerson.pronoun === 'he' ? 'bg-blue-200' : '')}
						>
							He
						</button>
						<button
							onclick={(e) => {
								e.preventDefault();
								updatePronoun('she');
							}}
							class={'btn rounded-full border border-pink-300 ' +
								(currentFormPerson.pronoun === 'she' ? 'bg-pink-200' : '')}
						>
							She
						</button>
					</div>
				</div>
			</div>
		</form>

		<!-- Person's Classrooms -->
		<form
			class="bg-surface-200-800/70 flex w-full flex-col items-start justify-start gap-2 rounded-2xl p-2"
		>
			<div class="grid w-full grid-cols-4 justify-between gap-x-3 px-4">
				<span class="h3 col-span-2 m-0 text-center"> Classrooms </span>
				<button type="submit" class="btn preset-filled-success-500 rounded-full border">
					Update
				</button>
				<button
					type="button"
					class="btn preset-filled-secondary-500 rounded-full border"
					onclick={resetForm}
				>
					Reset
				</button>
			</div>
			<div class="flex w-full gap-1 pr-2">
				<input
					type="text"
					class="input h-10 w-full flex-1 rounded-full placeholder:font-normal placeholder:italic placeholder:opacity-30"
					placeholder="Filter Classrooms..."
				/>
				<button class={'btn preset-outlined-surface-200-800 size-10 rounded-full p-0'}>
					<IconActivePerson class="inline-block" />
				</button>
				<button class={'btn preset-outlined-surface-200-800 size-10 rounded-full p-0'}>
					<IconGuestPerson class="inline-block" />
				</button>
			</div>

			<table
				class="table max-h-full min-w-full caption-top border-separate border-spacing-0 overflow-auto"
			>
				<colgroup>
					<col class="" />
					<col />
					<col />
				</colgroup>

				<tbody class="overflow-y-auto">
					{#each classrooms as classroom}
						<tr class="">
							<td class="w-full text-lg">
								{classroom.name}
							</td>
							<td class="flex gap-1">
								<button
									class={'btn preset-outlined-surface-200-800 aspect-square rounded-full p-2 ' +
										(currentPerson?.classroomIds.includes(classroom.id)
											? 'bg-surface-50-950 border-2'
											: '')}
								>
									<IconActivePerson />
								</button>
								<button
									class={'btn preset-outlined-surface-200-800 aspect-square rounded-full p-2 '}
								>
									<IconGuestPerson />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</form>

		<!--Person's Settings-->
		<form
			class="bg-surface-200-800/70 rounded-4xl grid w-full grid-cols-1 gap-3 p-2 md:grid-cols-2 xl:col-span-2"
		>
			<div class="grid grid-cols-4 justify-between gap-x-3 px-4 md:col-span-2">
				<span class="h3 col-span-2 m-0 text-center"> Settings </span>
				<button type="submit" class="btn preset-filled-success-500 rounded-full border">
					Update
				</button>
				<button
					type="button"
					class="btn preset-filled-secondary-500 rounded-full border"
					onclick={resetForm}
				>
					Reset
				</button>
			</div>
			<div
				class="bg-surface-400-600/70 grid gap-x-2 gap-y-1 rounded-2xl p-1 [&>label]:self-center [&>label]:leading-tight"
			>
				<span class="col-span-4 text-center text-xl font-semibold"> Youtube Video </span>
				<!-- svelte-ignore a11y_missing_attribute -->
				<iframe src={vidPreviewUrl} class="rounded-4xl col-span-4 aspect-video w-full"></iframe>
				<input
					id="default-person-video-id"
					type="text"
					class="input col-span-4 w-full rounded-full placeholder:font-normal placeholder:italic placeholder:opacity-30"
					placeholder="Youtube URL or ID"
					bind:value={vidIdInput}
				/>
				<div class="col-span-1 flex items-center justify-center">
					<input
						id="default-person-video-end"
						type="number"
						class="input placeholder:translate-0.5 w-full rounded-full text-center text-lg placeholder:font-normal placeholder:italic placeholder:opacity-30"
						placeholder="0"
						min="0"
					/>
					<span class="pl-1 text-lg"> M </span>
				</div>
				<div class="col-span-1 flex items-center justify-center">
					<input
						id="default-person-video-end"
						type="number"
						class="input placeholder:translate-0.5 w-full rounded-full text-center text-lg placeholder:font-normal placeholder:italic placeholder:opacity-30"
						placeholder="0"
						min="0"
						max="59.9"
					/>
					<span class="pl-1 text-lg"> S </span>
				</div>
				<div class="col-span-1 flex items-center justify-center">
					<span class="items-center justify-center text-lg">for</span>
				</div>
				<div class="col-span-1 flex items-center justify-center">
					<input
						id="default-person-video-end"
						type="number"
						class="input placeholder:translate-0.5 w-full rounded-full text-center text-lg placeholder:font-normal placeholder:italic placeholder:opacity-30"
						placeholder="25"
						min="0"
					/>
					<span class="pl-1 text-lg"> S </span>
				</div>
			</div>
			<div class="bg-surface-400-600/70 grid grid-cols-3 rounded-2xl p-1">
				<span class="col-span-3 text-center text-xl font-semibold"> Emotions </span>
			</div>
			<div
				class="bg-surface-400-600/70 grid grid-cols-6 gap-x-2 gap-y-1 rounded-2xl p-1 [&>label]:self-center [&>label]:leading-tight"
			>
				<span class="col-span-6 text-center text-xl font-semibold"> Answering Questions </span>
				<div
					class="bg-surface-200-800 col-span-3 grid grid-cols-2 gap-1 rounded-2xl p-1 text-center"
				>
					<span class="col-span-2 text-lg font-semibold">Polls</span>
					<button
						class="btn preset-outlined rounded-4xl flex flex-col items-center justify-center overflow-hidden"
					>
						<span class="text-sm">Numbers</span>
					</button>
					<button
						class="btn preset-outlined rounded-4xl flex flex-col items-center justify-center overflow-hidden"
					>
						<span class="text-sm">Words</span>
					</button>
				</div>
				<div
					class="bg-surface-200-800 col-span-3 grid grid-cols-2 gap-1 rounded-2xl p-1 text-center"
				>
					<span class="col-span-2 text-lg font-semibold">Polls</span>
					<button
						class="btn preset-outlined rounded-4xl flex flex-col items-center justify-center overflow-hidden"
					>
						<span class="text-sm">Numbers</span>
					</button>
					<button
						class="btn preset-outlined rounded-4xl flex flex-col items-center justify-center overflow-hidden"
					>
						<span class="text-sm">Words</span>
					</button>
				</div>
				<label for="person-options-num" class="col-span-6 text-center font-bold">
					X Options for Y
				</label>
				<select id="person-options-num" class="select col-span-4 rounded-full">
					<option value="multi">Multiple Choice</option>
					<option value="numpad">Number Pad</option>
				</select>
				<input
					type="number"
					class="input placeholder:translate-0.5 col-span-2 w-full rounded-full text-center text-lg placeholder:font-normal placeholder:italic placeholder:opacity-30"
					placeholder="1-9"
					min="1"
					max="9"
				/>
			</div>
			<div
				class="bg-surface-400-600/70 grid grid-cols-3 gap-x-2 gap-y-1 rounded-2xl p-1 outline-1 [&>label]:self-center [&>label]:leading-tight"
			>
				<span class="col-span-3 text-center text-xl font-semibold"> Ratings </span>
				<select class="select col-span-2 rounded-2xl">
					<option value="smileys">Smiley Faces</option>
					<option value="thumbs">Thumbs</option>
					<option value="yesno">Yes or No</option>
					<option value="scale">Scale</option>
				</select>
			</div>
		</form>
	</div>
</div>
