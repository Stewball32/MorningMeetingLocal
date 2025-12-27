<script lang="ts">
	import type { PageData } from './$types';
	import type { EmotionPB, EmotionTag } from '$lib/pb/schema';
	import { Emotion, ImageAsset, pbCreateRecord } from '$lib/pb';
	import { COLLECTION_NAMES } from '$lib/pb/constants';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import {
		ImageIcon,
		PlusIcon,
		RefreshCcwIcon,
		SaveIcon,
		SearchIcon,
		TagsIcon,
		Trash2Icon
	} from '@lucide/svelte';
	import { toaster } from '$lib/toaster';

	type EmotionForm = {
		id?: string;
		name: string;
		imageId: string;
		tags: EmotionTag[];
		priority: number;
	};

	const tagOptions: EmotionTag[] = [
		'positive',
		'neutral',
		'negative',
		'mild',
		'moderate',
		'severe',
		'health',
		'simple',
		'complex'
	];
	const maxTags = 2;

	let { data }: { data: PageData } = $props();

	let loadError = $state(data.loadError ?? '');
	let emotions = $state<Emotion[]>(data.emotions ?? []);
	let imageAssets = $state<ImageAsset[]>(data.imageAssets ?? []);

	const emotionImages = $derived.by(() =>
		imageAssets.filter((asset) => asset.tags.includes('emotion'))
	);

	let searchTerm = $state('');
	let activeEmotionId = $state<string | null>(null);
	let activeEmotion = $state<Emotion | null>(null);
	let emotionForm = $state<EmotionForm>(createEmptyForm());
	let formError = $state('');

	const createEmptyForm = (): EmotionForm => ({
		name: '',
		imageId: '',
		tags: [],
		priority: 0
	});

	const normalizeTags = (tags?: EmotionPB['tags']) => tags ?? [];

	const mapFromEmotion = (emotion: Emotion): EmotionForm => ({
		id: emotion.id,
		name: emotion.record.name ?? '',
		imageId: emotion.record.image ?? '',
		tags: normalizeTags(emotion.record.tags),
		priority: emotion.record.priority ?? 0
	});

	const visibleEmotions = $derived.by(() => {
		let next = emotions;
		if (searchTerm.trim()) {
			const q = searchTerm.trim().toLowerCase();
			next = next.filter((emotion) => emotion.name.toLowerCase().includes(q));
		}
		return next.toSorted((a, b) => {
			const priorityDelta = (a.record.priority ?? 0) - (b.record.priority ?? 0);
			if (priorityDelta !== 0) return priorityDelta;
			return a.name.localeCompare(b.name);
		});
	});

	const getEmotionImage = (imageId?: string) =>
		imageId ? emotionImages.find((asset) => asset.id === imageId) ?? null : null;

	const selectedImage = $derived.by(() =>
		emotionForm.imageId ? getEmotionImage(emotionForm.imageId) : null
	);

	const selectEmotion = (id: string) => {
		activeEmotionId = id;
	};

	const startNewEmotion = () => {
		activeEmotionId = null;
		activeEmotion = null;
		emotionForm = createEmptyForm();
		formError = '';
	};

	const resetForm = () => {
		formError = '';
		if (activeEmotion) {
			emotionForm = mapFromEmotion(activeEmotion);
		} else {
			emotionForm = createEmptyForm();
		}
	};

	const toggleTag = (tag: EmotionTag) => {
		const current = new Set(emotionForm.tags);
		if (current.has(tag)) {
			current.delete(tag);
		} else {
			if (current.size >= maxTags) return;
			current.add(tag);
		}
		emotionForm = { ...emotionForm, tags: Array.from(current) };
	};

	const isTagDisabled = (tag: EmotionTag) =>
		!emotionForm.tags.includes(tag) && emotionForm.tags.length >= maxTags;

	const updatePriority = (event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		emotionForm = {
			...emotionForm,
			priority: value === '' ? 0 : Number(value)
		};
	};

	$effect(() => {
		if (activeEmotionId) {
			const current = emotions.find((emotion) => emotion.id === activeEmotionId);
			if (current) {
				activeEmotion = current;
				emotionForm = mapFromEmotion(current);
			} else {
				activeEmotionId = null;
				activeEmotion = null;
				emotionForm = createEmptyForm();
			}
		} else {
			activeEmotion = null;
			emotionForm = createEmptyForm();
		}
		formError = '';
	});

	const handleSave = async (event: Event) => {
		event.preventDefault();
		formError = '';

		if (!emotionForm.name.trim()) {
			formError = 'Name is required.';
			return;
		}

		if (emotionForm.tags.length > maxTags) {
			formError = `Select up to ${maxTags} tags.`;
			return;
		}

		try {
			const isNew = !activeEmotion;
			const payload: Partial<EmotionPB> = {
				name: emotionForm.name.trim(),
				priority: Number.isFinite(emotionForm.priority) ? emotionForm.priority : 0,
				tags: emotionForm.tags
			};
			if (emotionForm.imageId) {
				payload.image = emotionForm.imageId;
			} else if (activeEmotion?.record.image) {
				payload.image = '';
			}

			let updatedEmotion: Emotion;
			if (isNew) {
				const created = await pbCreateRecord<EmotionPB>(
					COLLECTION_NAMES.Emotions,
					payload
				);
				updatedEmotion = new Emotion(created);
			} else {
				await activeEmotion.updateRecord(payload);
				updatedEmotion = activeEmotion;
			}

			emotions = emotions.filter((emotion) => emotion.id !== updatedEmotion.id);
			setTimeout(() => {
				emotions = [updatedEmotion, ...emotions].toSorted((a, b) => {
					const priorityDelta = (a.record.priority ?? 0) - (b.record.priority ?? 0);
					if (priorityDelta !== 0) return priorityDelta;
					return a.name.localeCompare(b.name);
				});
			}, 10);

			activeEmotionId = updatedEmotion.id;
			activeEmotion = updatedEmotion;

			toaster.success({
				title: `Emotion ${isNew ? 'created' : 'updated'}!`,
				description: updatedEmotion.name
			});
		} catch (error) {
			console.error(error);
			toaster.error({
				title: `Emotion failed to ${activeEmotion ? 'update' : 'save'}.`,
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};

	const handleDelete = async (event: Event) => {
		event.preventDefault();
		if (!activeEmotionId || !activeEmotion) return;
		try {
			const deletedEmotion = activeEmotion;
			await deletedEmotion.deleteRecord();
			emotions = emotions.filter((emotion) => emotion.id !== deletedEmotion.id);
			activeEmotionId = null;
			activeEmotion = null;
			emotionForm = createEmptyForm();
			toaster.success({
				title: 'Emotion deleted',
				description: deletedEmotion.name
			});
		} catch (error) {
			console.error(error);
			toaster.error({
				title: 'Delete failed',
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};
</script>

<div class="p-4">
	<div class="mx-auto flex max-w-6xl flex-col gap-4">
		<header class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
			<div class="space-y-1">
				<p class="text-sm uppercase tracking-wide text-surface-700-300">Emotions</p>
				<h1 class="text-2xl font-bold">Manage Emotions</h1>
				<p class="text-sm text-surface-700-300">
					Create, edit, or delete the emotions available in the app.
				</p>
			</div>
			<button
				type="button"
				onclick={startNewEmotion}
				class="btn preset-filled-primary-500 flex items-center gap-2 rounded-full px-4"
			>
				<PlusIcon class="size-4" />
				New Emotion
			</button>
		</header>

		{#if loadError}
			<div class="card border border-error-500 bg-error-50-950/60 p-4">
				<p class="font-semibold text-error-500">Could not load emotions</p>
				<p class="text-sm text-error-500/90">{loadError}</p>
			</div>
		{:else}
			<div class="grid gap-4 lg:grid-cols-[320px_1fr]">
				<section class="flex h-full flex-col gap-3 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
					<div class="grid grid-cols-[1fr_auto] items-center gap-2">
						<div class="relative">
							<SearchIcon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500-400" />
							<input
								type="search"
								placeholder="Search emotions"
								class="input w-full rounded-full bg-surface-50-950 pl-10"
								bind:value={searchTerm}
							/>
						</div>
						<button
							type="button"
							onclick={startNewEmotion}
							class="btn preset-filled-primary-500 flex items-center gap-2 rounded-full px-3"
						>
							<PlusIcon class="size-4" />
							New
						</button>
					</div>

					<div class="max-h-[70vh] space-y-2 overflow-auto pr-1">
						{#if !visibleEmotions.length}
							<p class="text-sm italic text-surface-700-300">No emotions match this filter.</p>
						{:else}
							{#each visibleEmotions as emotion}
								{@const emotionImage = getEmotionImage(emotion.record.image)}
								<button
									type="button"
									onclick={() => selectEmotion(emotion.id)}
									class={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
										emotion.id === activeEmotionId
											? 'border-primary-400-600 bg-primary-100-900/50'
											: 'border-surface-200-800 hover:border-primary-200 hover:bg-surface-50-950'
									}`}
								>
									<Avatar class="size-10 shrink-0 bg-surface-200-800">
										<Avatar.Image
											src={emotionImage?.imagePath ?? ''}
											alt={emotion.name}
											class="h-full w-full object-contain"
										/>
										<Avatar.Fallback class="text-xs font-semibold text-surface-500-400">
											{emotion.name?.slice(0, 2)?.toUpperCase() ?? ''}
										</Avatar.Fallback>
									</Avatar>
									<div class="flex-1">
										<p class="font-semibold leading-5">{emotion.name}</p>
										<div class="flex flex-wrap items-center gap-1 text-xs text-surface-600-400">
											{#if normalizeTags(emotion.record.tags).length}
												{#each normalizeTags(emotion.record.tags) as tag}
													<span class="rounded-full bg-surface-50-950 px-2 py-0.5">{tag}</span>
												{/each}
											{:else}
												<span class="italic">No tags</span>
											{/if}
										</div>
									</div>
									<span class="text-xs text-surface-600-400">Priority {emotion.record.priority ?? 0}</span>
								</button>
							{/each}
						{/if}
					</div>
				</section>

				<section class="flex flex-col gap-4 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
					<div class="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200-800 pb-3">
						<div>
							<p class="text-xs uppercase tracking-wide text-surface-700-300">
								{activeEmotionId ? 'Editing emotion' : 'Creating new emotion'}
							</p>
							<h2 class="text-xl font-semibold">
								{emotionForm.name || 'Untitled emotion'}
							</h2>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<button
								type="button"
								class="btn preset-filled-success-500 flex items-center gap-2 rounded-full px-3"
								onclick={handleSave}
							>
								<SaveIcon class="size-4" />
								Save
							</button>
							<button
								type="button"
								class="btn preset-outlined-warning-500 flex items-center gap-2 rounded-full px-3"
								onclick={resetForm}
							>
								<RefreshCcwIcon class="size-4" />
								Reset
							</button>
							<button
								type="button"
								class="btn preset-outlined-error-500 flex items-center gap-2 rounded-full px-3"
								onclick={handleDelete}
								disabled={!activeEmotionId}
							>
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
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="space-y-1 sm:col-span-2">
								<span class="text-sm font-semibold">Name</span>
								<input
									class="input w-full rounded-full"
									type="text"
									bind:value={emotionForm.name}
									required
								/>
							</label>

							<label class="space-y-1">
								<span class="text-sm font-semibold">Priority</span>
								<input
									class="input w-full rounded-full"
									type="number"
									min="0"
									value={emotionForm.priority}
									oninput={updatePriority}
								/>
							</label>

							<label class="space-y-1">
								<span class="text-sm font-semibold">Image Asset</span>
								<div class="space-y-2">
									<select class="select w-full rounded-full" bind:value={emotionForm.imageId}>
										<option value="">No image selected</option>
										{#each emotionImages as asset}
											<option value={asset.id}>{asset.label}</option>
										{/each}
									</select>
									<div class="flex items-center gap-3 rounded-xl border border-surface-200-800 bg-surface-50-950 px-3 py-2">
										<Avatar class="size-12 shrink-0 bg-surface-200-800">
											<Avatar.Image
												src={selectedImage?.imagePath ?? ''}
												alt={selectedImage?.label ?? 'No image'}
												class="h-full w-full object-contain"
											/>
											<Avatar.Fallback class="text-xs font-semibold text-surface-500-400">
												<ImageIcon class="size-4" />
											</Avatar.Fallback>
										</Avatar>
										<div class="text-sm">
											<p class="font-medium">
												{selectedImage?.label ?? 'No image selected'}
											</p>
											<p class="text-xs text-surface-600-400">
												{selectedImage?.name ?? 'Choose an image asset tagged as emotion.'}
											</p>
										</div>
									</div>
								</div>
							</label>
						</div>

						<div class="space-y-3 rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4">
							<div class="flex items-start justify-between gap-3">
								<div>
									<h3 class="text-lg font-semibold">Tags</h3>
									<p class="text-xs text-surface-700-300">
										Pick up to {maxTags} tags.
									</p>
								</div>
								<TagsIcon class="size-5 text-surface-500-400" />
							</div>
							<div class="flex flex-wrap gap-2">
								{#each tagOptions as tag}
									{@const selected = emotionForm.tags.includes(tag)}
									<button
										type="button"
										onclick={() => toggleTag(tag)}
										disabled={isTagDisabled(tag)}
										class={`btn rounded-full px-3 py-1 text-xs capitalize ${
											selected
												? 'preset-filled-primary-500'
												: 'preset-outlined-surface-200-800'
										} ${isTagDisabled(tag) ? 'opacity-50' : ''}`}
									>
										{tag}
									</button>
								{/each}
							</div>
						</div>
					</form>
				</section>
			</div>
		{/if}
	</div>
</div>
