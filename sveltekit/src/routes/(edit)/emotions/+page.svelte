<script lang="ts">
	import type { PageData } from './$types';
	import type { EmotionPB } from '$lib/pb/schema';
	import { Emotion, ImageAsset, SchoolBuilder } from '$lib/pb';
	import { PlusIcon, RefreshCcwIcon, SaveIcon, SearchIcon, Trash2Icon } from '@lucide/svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster';

	type EmotionTag = EmotionPB['tags'][number];

	type EmotionForm = {
		id?: string;
		name: string;
		imageId: string;
		tags: EmotionTag[];
		priority: number;
	};

	let { data }: { data: PageData } = $props();

	let loadError = $state(data.loadError ?? '');
	let emotions = $state<Emotion[]>(data.emotions ?? []);
	let imageAssets = $state<ImageAsset[]>(data.imageAssets ?? []);
	let searchTerm = $state('');
	let activeEmotionId = $state<string | null>(null);
	let activeEmotion = $state<Emotion | null>(null);
	let emotionForm = $state<EmotionForm>(createEmptyForm());

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

	const createEmptyForm = (): EmotionForm => ({
		name: '',
		imageId: '',
		tags: [],
		priority: 0
	});

	const mapFromEmotion = (emotion: Emotion): EmotionForm => ({
		id: emotion.id,
		name: emotion.name ?? '',
		imageId: emotion.record.image ?? '',
		tags: emotion.record.tags ?? [],
		priority: emotion.record.priority ?? 0
	});

	const compareEmotions = (a: Emotion, b: Emotion) => {
		const priorityDiff = (a.record.priority ?? 0) - (b.record.priority ?? 0);
		if (priorityDiff !== 0) return priorityDiff;
		return a.name.localeCompare(b.name);
	};

	const visibleEmotions = $derived.by(() => {
		let next = emotions;
		if (searchTerm.trim()) {
			const q = searchTerm.trim().toLowerCase();
			next = next.filter((emotion) => emotion.name.toLowerCase().includes(q));
		}
		return next.toSorted(compareEmotions);
	});

	const sortedImageAssets = $derived.by(() =>
		[...imageAssets].toSorted((a, b) => a.label.localeCompare(b.label))
	);

	const imageById = $derived.by(() => new Map(imageAssets.map((image) => [image.id, image])));

	const selectedImage = $derived.by(() => imageById.get(emotionForm.imageId) ?? null);

	$effect(() => {
		if (activeEmotionId) {
			const current = emotions.find((emotion) => emotion.id === activeEmotionId);
			if (current) {
				emotionForm = mapFromEmotion(current);
				activeEmotion = current;
			} else {
				activeEmotionId = null;
				emotionForm = createEmptyForm();
				activeEmotion = null;
			}
		} else {
			emotionForm = createEmptyForm();
			activeEmotion = null;
		}
	});

	const selectEmotion = (id: string) => {
		activeEmotionId = id;
	};

	const startNewEmotion = () => {
		activeEmotionId = null;
		activeEmotion = null;
		emotionForm = createEmptyForm();
	};

	const resetForm = () => {
		if (activeEmotionId) {
			const current = emotions.find((emotion) => emotion.id === activeEmotionId);
			emotionForm = current ? mapFromEmotion(current) : createEmptyForm();
		} else {
			emotionForm = createEmptyForm();
		}
	};

	const toggleTag = (tag: EmotionTag) => {
		const next = new Set(emotionForm.tags);
		if (next.has(tag)) {
			next.delete(tag);
		} else {
			next.add(tag);
		}
		emotionForm = { ...emotionForm, tags: Array.from(next) };
	};

	const handleSave = async (e: Event) => {
		e.preventDefault();
		const isNew = !activeEmotion;
		let partial: Partial<EmotionPB> = {};
		let savedEmotion: Emotion | null = null;
		try {
			if (!emotionForm.name.trim()) {
				throw new Error('Emotion name is required.');
			}

			if (!activeEmotion) {
				partial = {
					name: emotionForm.name.trim(),
					image: emotionForm.imageId,
					tags: emotionForm.tags,
					priority: emotionForm.priority
				};
				savedEmotion = await SchoolBuilder.createEmotion(partial);
			} else {
				if (emotionForm.name.trim() !== activeEmotion.record.name) {
					partial.name = emotionForm.name.trim();
				}
				if ((emotionForm.imageId || '') !== (activeEmotion.record.image || '')) {
					partial.image = emotionForm.imageId;
				}
				if (emotionForm.priority !== activeEmotion.record.priority) {
					partial.priority = emotionForm.priority;
				}
				const currentTags = activeEmotion.record.tags ?? [];
				const nextTags = [...emotionForm.tags].toSorted();
				if (JSON.stringify(nextTags) !== JSON.stringify([...currentTags].toSorted())) {
					partial.tags = emotionForm.tags;
				}

				if (Object.keys(partial).length) {
					await activeEmotion.updateRecord(partial);
				}
				savedEmotion = activeEmotion;
			}

			if (!savedEmotion) return;
			const next = emotions.filter((emotion) => emotion.id !== savedEmotion?.id);
			emotions = [...next];
			setTimeout(() => (emotions = [savedEmotion!, ...next].toSorted(compareEmotions)), 10);
			activeEmotionId = savedEmotion.id;
			activeEmotion = savedEmotion;

			toaster.success({
				title: `Emotion ${isNew ? 'created' : 'updated'}`,
				description: savedEmotion.name
			});
		} catch (error) {
			console.error(error);
			toaster.error({
				title: `Emotion failed to ${isNew ? 'save' : 'update'}`,
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};

	const handleDelete = async (e: Event) => {
		e.preventDefault();
		if (!activeEmotionId) return;
		const emotionIndex = emotions.findIndex((emotion) => emotion.id === activeEmotionId);
		if (emotionIndex === -1) return;
		try {
			const deletedEmotion = emotions.splice(emotionIndex, 1)?.[0];
			await deletedEmotion.deleteRecord();
			emotions = [...emotions];
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
				<h1 class="text-2xl font-bold">Edit & Add Emotions</h1>
				<p class="text-sm text-surface-700-300">
					Create new emotions, update their details, and manage the visuals used across the app.
				</p>
			</div>
		</header>

		{#if loadError}
			<div class="card border border-error-500 bg-error-50-950/60 p-4">
				<p class="font-semibold text-error-500">Could not load emotions</p>
				<p class="text-sm text-error-500/90">{loadError}</p>
			</div>
		{:else}
			<div class="grid gap-4 lg:grid-cols-[360px_1fr]">
				<section class="flex h-full flex-col gap-3 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
					<div class="grid items-center gap-2 sm:grid-cols-[1fr_auto]">
						<div class="relative">
							<SearchIcon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500-400" />
							<input
								type="search"
								placeholder="Filter by name"
								class="input w-full rounded-full bg-surface-50-950 pl-10"
								bind:value={searchTerm}
							/>
						</div>
						<button
							type="button"
							onclick={startNewEmotion}
							class="btn preset-filled-primary-500 flex items-center gap-2 rounded-full"
						>
							<PlusIcon class="size-4" />
							New Emotion
						</button>
					</div>

					<div class="max-h-[70vh] space-y-2 overflow-auto pr-1">
						{#if !visibleEmotions.length}
							<p class="text-sm italic text-surface-700-300">No emotions match this filter.</p>
						{:else}
							{#each visibleEmotions as emotion}
								<button
									type="button"
									onclick={() => selectEmotion(emotion.id)}
									class={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
										emotion.id === activeEmotionId
											? 'border-primary-400-600 bg-primary-100-900/50'
											: 'border-surface-200-800 hover:border-primary-200 hover:bg-surface-50-950'
									}`}
								>
									<Avatar class="h-12 w-12 shrink-0 bg-surface-200-800">
										{#if imageById.get(emotion.record.image)?.imagePath}
											<Avatar.Image
												src={imageById.get(emotion.record.image)?.imagePath}
												alt={emotion.name}
												class="h-full w-full object-contain"
											/>
										{:else}
											<Avatar.Fallback class="text-sm font-semibold text-surface-500-400">
												{emotion.name?.slice(0, 2)?.toUpperCase() ?? '?'}
											</Avatar.Fallback>
										{/if}
									</Avatar>
									<div class="flex flex-1 flex-col">
										<p class="font-semibold leading-5">{emotion.name}</p>
										{#if emotion.record.tags?.length}
											<div class="mt-1 flex flex-wrap gap-1">
												{#each emotion.record.tags as tag}
													<span class="rounded-full bg-surface-50-950 px-2 py-0.5 text-[10px] text-surface-700-300">
														{tag}
													</span>
												{/each}
											</div>
										{/if}
									</div>
									<div class="text-right text-xs text-surface-600-400">
										<p>Priority {emotion.record.priority}</p>
									</div>
								</button>
							{/each}
						{/if}
					</div>
				</section>

				<section class="flex flex-col gap-4 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
					<div class="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200-800 pb-3">
						<div>
							<p class="text-xs uppercase tracking-wide text-surface-700-300">
								{activeEmotionId ? 'Editing existing emotion' : 'Creating new emotion'}
							</p>
							<h2 class="text-xl font-semibold">{emotionForm.name || 'Untitled emotion'}</h2>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<button
								type="button"
								class="btn preset-filled-success-500 flex items-center gap-2 rounded-full px-3"
								onclick={handleSave}
							>
								<SaveIcon class="size-4" />
								{emotionForm.id ? 'Update' : 'Save'}
							</button>
							<button
								type="button"
								class="btn preset-outlined-warning-500 flex items-center gap-2 rounded-full px-3"
								onclick={resetForm}
							>
								<RefreshCcwIcon class="size-4" />
								{emotionForm.id ? 'Reset' : 'Clear'}
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

					<form class="space-y-4" onsubmit={handleSave}>
						<div class="grid gap-4 md:grid-cols-[200px_1fr]">
							<div class="flex flex-col items-center gap-3 rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4">
								<span class="text-sm font-semibold">Image Asset</span>
								<Avatar class="h-32 w-32 overflow-hidden rounded-full border border-dashed border-surface-200-800 bg-surface-100-900">
									{#if selectedImage?.imagePath}
										<Avatar.Image
											src={selectedImage.imagePath}
											alt={selectedImage.label}
											class="h-full w-full object-contain"
										/>
									{:else}
										<Avatar.Fallback class="text-sm text-surface-700-300">
											Select an image
										</Avatar.Fallback>
									{/if}
								</Avatar>
								{#if emotionForm.id}
									<code class="truncate text-[10px] text-surface-700-300">{emotionForm.id}</code>
								{/if}
							</div>

							<div class="grid gap-3 sm:grid-cols-2">
								<label class="space-y-1 sm:col-span-2">
									<span class="text-sm font-semibold">Name</span>
									<input
										class="input w-full rounded-full"
										type="text"
										required
										bind:value={emotionForm.name}
									/>
								</label>

								<label class="space-y-1 sm:col-span-2">
									<span class="text-sm font-semibold">Image</span>
									<select class="select w-full rounded-full" bind:value={emotionForm.imageId}>
										<option value="">No image</option>
										{#each sortedImageAssets as image}
											<option value={image.id}>{image.label}</option>
										{/each}
									</select>
								</label>

								<label class="space-y-1">
									<span class="text-sm font-semibold">Priority</span>
									<input
										class="input w-full rounded-full"
										type="number"
										min="0"
										step="1"
										bind:value={emotionForm.priority}
									/>
								</label>
							</div>
						</div>

						<div class="space-y-2">
							<span class="text-sm font-semibold">Tags</span>
							<div class="flex flex-wrap gap-2">
								{#each tagOptions as tag}
									<button
										type="button"
										class={`btn rounded-full px-3 py-1 text-xs ${
											emotionForm.tags.includes(tag)
												? 'preset-filled-primary-500'
												: 'preset-outlined-surface-200-800'
										}`}
										onclick={() => toggleTag(tag)}
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
