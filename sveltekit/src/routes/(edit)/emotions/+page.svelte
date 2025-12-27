<script lang="ts">
	import type { PageData } from './$types';
	import type { EmotionPB } from '$lib/pb';
	import { Emotion, ImageAsset, pbCreateRecord } from '$lib/pb';
	import { COLLECTION_NAMES } from '$lib/pb/constants';
	import { PlusIcon, RefreshCcwIcon, SaveIcon, Trash2Icon } from '@lucide/svelte';
	import { toaster } from '$lib/toaster';

	let { data }: { data: PageData } = $props();

	let loadError = $state(data.loadError ?? '');
	let emotions = $state<Emotion[]>(data.emotions ?? []);
	let imageAssets = $state<ImageAsset[]>(data.ImageAssets ?? []);

	const tagOptions = [
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

	type EmotionForm = {
		id?: string;
		name: string;
		imageId: string;
		tags: string[];
		priority: number;
	};

	const normalizeTags = (value: EmotionPB['tags'] | string | string[] | undefined): string[] => {
		if (!value) return [];
		if (Array.isArray(value)) return value.filter(Boolean);
		return [value];
	};

	const createEmptyEmotionForm = (): EmotionForm => ({
		name: '',
		imageId: '',
		tags: [],
		priority: 0
	});

	const mapFromEmotion = (emotion: Emotion): EmotionForm => ({
		id: emotion.id,
		name: emotion.record.name ?? '',
		imageId: emotion.record.image ?? '',
		tags: normalizeTags(emotion.record.tags),
		priority: Number(emotion.record.priority ?? 0)
	});

	const sortEmotions = (list: Emotion[]) =>
		list.toSorted(
			(a, b) => a.record.priority - b.record.priority || a.record.name.localeCompare(b.record.name)
		);

	let activeEmotionId = $state<string | null>(null);
	let activeEmotion = $state<Emotion | null>(null);
	let emotionForm = $state<EmotionForm>(createEmptyEmotionForm());

	$effect(() => {
		if (activeEmotionId) {
			const current = emotions.find((emotion) => emotion.id === activeEmotionId);
			if (current) {
				emotionForm = mapFromEmotion(current);
				activeEmotion = current;
			} else {
				activeEmotionId = null;
				emotionForm = createEmptyEmotionForm();
				activeEmotion = null;
			}
		} else {
			emotionForm = createEmptyEmotionForm();
			activeEmotion = null;
		}
	});

	const selectedImage = $derived.by(
		() => imageAssets.find((asset) => asset.id === emotionForm.imageId) ?? null
	);

	const selectEmotion = (id: string) => {
		activeEmotionId = id;
	};

	const startNewEmotion = () => {
		activeEmotionId = null;
		activeEmotion = null;
		emotionForm = createEmptyEmotionForm();
	};

	const resetForm = () => {
		if (activeEmotionId) {
			const current = emotions.find((emotion) => emotion.id === activeEmotionId);
			emotionForm = current ? mapFromEmotion(current) : createEmptyEmotionForm();
		} else {
			emotionForm = createEmptyEmotionForm();
		}
	};

	const toggleTag = (tag: string) => {
		const next = new Set(emotionForm.tags);
		if (next.has(tag)) {
			next.delete(tag);
		} else {
			next.add(tag);
		}
		emotionForm = { ...emotionForm, tags: Array.from(next) };
	};

	const handleSave = async (event: Event) => {
		event.preventDefault();
		const isNew = !activeEmotion;

		try {
			if (!emotionForm.name.trim()) throw new Error('Name is required.');
			if (!emotionForm.imageId) throw new Error('Image asset is required.');

			const payload: Partial<EmotionPB> = {
				name: emotionForm.name.trim(),
				image: emotionForm.imageId,
				priority: Number(emotionForm.priority) || 0,
				tags: emotionForm.tags
			};

			if (isNew) {
				const record = await pbCreateRecord<EmotionPB>(COLLECTION_NAMES.Emotions, payload);
				const newEmotion = new Emotion(record);
				emotions = sortEmotions([...emotions, newEmotion]);
				activeEmotionId = newEmotion.id;
				activeEmotion = newEmotion;
			} else if (activeEmotion) {
				const partial: Partial<EmotionPB> = {};
				if (emotionForm.name.trim() !== activeEmotion.record.name) {
					partial.name = emotionForm.name.trim();
				}
				if (emotionForm.imageId !== activeEmotion.record.image) {
					partial.image = emotionForm.imageId;
				}
				if (Number(emotionForm.priority) !== activeEmotion.record.priority) {
					partial.priority = Number(emotionForm.priority) || 0;
				}
				const currentTags = normalizeTags(activeEmotion.record.tags).toSorted();
				const nextTags = [...emotionForm.tags].toSorted();
				if (JSON.stringify(currentTags) !== JSON.stringify(nextTags)) {
					partial.tags = emotionForm.tags;
				}

				if (Object.keys(partial).length) {
					await activeEmotion.updateRecord(partial);
					emotions = sortEmotions(
						emotions.map((emotion) =>
							emotion.id === activeEmotion.id ? activeEmotion : emotion
						)
					);
				}
			}

			toaster.success({
				title: `Success! ${emotionForm.name} ${isNew ? 'created' : 'updated'}.`
			});
		} catch (error) {
			console.error(error);
			toaster.error({
				title: `Error: ${emotionForm.name || 'Emotion'} failed to ${isNew ? 'save' : 'update'}.`,
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};

	const handleDelete = async (event: Event) => {
		event.preventDefault();
		if (!activeEmotion) return;
		const confirmed = confirm(`Delete ${activeEmotion.name}? This cannot be undone.`);
		if (!confirmed) return;

		try {
			await activeEmotion.deleteRecord();
			emotions = emotions.filter((emotion) => emotion.id !== activeEmotion.id);
			activeEmotionId = null;
			activeEmotion = null;
			emotionForm = createEmptyEmotionForm();

			toaster.success({
				title: `Deleted ${activeEmotion.name}.`
			});
		} catch (error) {
			console.error(error);
			toaster.error({
				title: `Error: failed to delete ${activeEmotion.name}.`,
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h1 class="text-2xl font-semibold">Emotions</h1>
			<p class="text-sm text-surface-600-400">Create, edit, and manage emotion settings.</p>
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

	{#if loadError}
		<p class="rounded-xl border border-error-500/40 bg-error-100/10 px-4 py-2 text-sm text-error-500">
			{loadError}
		</p>
	{/if}

	<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
		<section class="rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">All Emotions</h2>
				<span class="text-xs text-surface-600-400">{emotions.length} total</span>
			</div>
			<div class="max-h-[65vh] space-y-2 overflow-auto pr-1">
				{#if !emotions.length}
					<p class="text-sm italic text-surface-600-400">
						No emotions yet. Create one to get started.
					</p>
				{:else}
					{#each sortEmotions(emotions) as emotion}
						<button
							type="button"
							onclick={() => selectEmotion(emotion.id)}
							class={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
								emotion.id === activeEmotionId
									? 'border-primary-400-600 bg-primary-100-900/50'
									: 'border-surface-200-800 hover:border-primary-200 hover:bg-surface-50-950'
							}`}
						>
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-200-800">
								{#if emotion.imageId}
									<img
										src={(imageAssets.find((asset) => asset.id === emotion.imageId) ?? null)?.imagePath}
										alt={emotion.name}
										class="h-8 w-8 object-contain"
									/>
								{:else}
									<span class="text-xs text-surface-600-400">No image</span>
								{/if}
							</div>
							<div class="flex-1">
								<p class="font-semibold">{emotion.name}</p>
								<p class="text-xs text-surface-600-400">
									Priority {emotion.priority ?? 0}
								</p>
							</div>
							<div class="text-right text-xs text-surface-600-400">
								{#if normalizeTags(emotion.record.tags).length}
									{normalizeTags(emotion.record.tags).join(', ')}
								{:else}
									No tags
								{/if}
							</div>
						</button>
					{/each}
				{/if}
			</div>
		</section>

		<section class="rounded-2xl border border-surface-200-800 bg-surface-50-950 p-5 shadow-sm">
			<h2 class="text-lg font-semibold">
				{activeEmotion ? `Edit ${activeEmotion.name}` : 'Create Emotion'}
			</h2>
			<p class="text-sm text-surface-600-400">
				Update the name, image, tags, and priority for this emotion.
			</p>

			<form class="mt-4 space-y-4" onsubmit={handleSave}>
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="space-y-1 text-sm font-medium">
						<span>Name</span>
						<input
							type="text"
							class="input rounded-xl"
							placeholder="Emotion name"
							bind:value={emotionForm.name}
							required
						/>
					</label>
					<label class="space-y-1 text-sm font-medium">
						<span>Priority</span>
						<input
							type="number"
							class="input rounded-xl"
							bind:value={emotionForm.priority}
							min="0"
						/>
					</label>
				</div>

				<label class="space-y-1 text-sm font-medium">
					<span>Image Asset</span>
					<select class="select rounded-xl" bind:value={emotionForm.imageId} required>
						<option value="" disabled>Select an image</option>
						{#each imageAssets as asset}
							<option value={asset.id}>{asset.label}</option>
						{/each}
					</select>
				</label>

				{#if selectedImage}
					<div class="flex items-center gap-4 rounded-xl border border-surface-200-800 bg-surface-100-900/40 p-3">
						<img
							src={selectedImage.imagePath}
							alt={selectedImage.label}
							class="h-16 w-16 rounded-lg object-contain"
						/>
						<div>
							<p class="text-sm font-medium">{selectedImage.label}</p>
							<p class="text-xs text-surface-600-400">
								Tags: {selectedImage.tags.join(', ') || 'None'}
							</p>
						</div>
					</div>
				{/if}

				<div>
					<p class="text-sm font-medium">Tags</p>
					<p class="text-xs text-surface-600-400">Select all that apply.</p>
					<div class="mt-2 grid gap-2 sm:grid-cols-3">
						{#each tagOptions as tag}
							<label class="flex items-center gap-2 rounded-lg border border-surface-200-800 px-3 py-2 text-sm">
								<input
									type="checkbox"
									checked={emotionForm.tags.includes(tag)}
									onchange={() => toggleTag(tag)}
								/>
								<span class="capitalize">{tag}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="flex flex-wrap gap-2">
					<button
						type="submit"
						class="btn preset-filled-success-500 flex items-center gap-2 rounded-full px-3"
					>
						<SaveIcon class="size-4" />
						{activeEmotion ? 'Save Changes' : 'Create Emotion'}
					</button>
					<button
						type="button"
						onclick={resetForm}
						class="btn preset-outlined-warning-500 flex items-center gap-2 rounded-full px-3"
					>
						<RefreshCcwIcon class="size-4" />
						Reset
					</button>
					<button
						type="button"
						onclick={handleDelete}
						disabled={!activeEmotion}
						class="btn preset-outlined-error-500 flex items-center gap-2 rounded-full px-3"
					>
						<Trash2Icon class="size-4" />
						Delete
					</button>
				</div>
			</form>
		</section>
	</div>
</div>
