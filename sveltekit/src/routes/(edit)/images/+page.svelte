<script lang="ts">
	import { onMount } from 'svelte';
	import type { ImagePB } from '$lib/pb/schema';
	import { ImageAsset, SchoolBuilder, pbCreateRecord } from '$lib/pb';
	import { COLLECTION_NAMES } from '$lib/pb/constants';
	import { PlusIcon, RefreshCcwIcon, SaveIcon, Trash2Icon } from '@lucide/svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster';

	type TagOption = 'guest' | 'calendar' | 'emotion';
	type ImageForm = {
		id?: string;
		name: string;
		label: string;
		imagePath: string;
		imageFile: File | null;
		tags: TagOption[];
	};

	const tagOptions: TagOption[] = ['guest', 'calendar', 'emotion'];

	let loadError = $state('');
	let imageAssets = $state<ImageAsset[]>([]);

	const createEmptyForm = (): ImageForm => ({
		name: '',
		label: '',
		imagePath: '',
		imageFile: null,
		tags: []
	});

	const mapFromImage = (asset: ImageAsset): ImageForm => ({
		id: asset.id,
		name: asset.name ?? '',
		label: asset.record.label ?? '',
		imagePath: asset.imagePath,
		imageFile: null,
		tags: [...asset.tags]
	});

	let activeImageId = $state<string | null>(null);
	let activeImage = $state<ImageAsset | null>(null);
	let imageForm = $state<ImageForm>(createEmptyForm());
	let imagePreview = $state('');

	const loadImages = async () => {
		try {
			imageAssets = await SchoolBuilder.getAllImageAssets();
			loadError = '';
		} catch (error) {
			console.error(error);
			loadError = 'Could not reach PocketBase. Is it running at PUBLIC_POCKETBASE_URL?';
		}
	};

	onMount(loadImages);

	$effect(() => {
		if (activeImageId) {
			const current = imageAssets.find((asset) => asset.id === activeImageId);
			if (current) {
				imageForm = mapFromImage(current);
				activeImage = current;
			} else {
				activeImageId = null;
				activeImage = null;
				imageForm = createEmptyForm();
			}
		} else {
			activeImage = null;
			imageForm = createEmptyForm();
		}
		imagePreview = '';
	});

	const startNewImage = () => {
		activeImageId = null;
		activeImage = null;
		imageForm = createEmptyForm();
		imagePreview = '';
	};

	const resetForm = () => {
		if (activeImageId) {
			const current = imageAssets.find((asset) => asset.id === activeImageId);
			imageForm = current ? mapFromImage(current) : createEmptyForm();
		} else {
			imageForm = createEmptyForm();
		}
		imagePreview = '';
	};

	const selectImage = (id: string) => {
		activeImageId = id;
	};

	const toggleTag = (tag: TagOption) => {
		imageForm.tags = imageForm.tags.includes(tag)
			? imageForm.tags.filter((entry) => entry !== tag)
			: [...imageForm.tags, tag];
	};

	const setImageFile = (file: File | null) => {
		imageForm.imageFile = file;
		imagePreview = file ? URL.createObjectURL(file) : '';
	};

	const handleImageAccept = (files: File[]) => {
		setImageFile(files?.[0] ?? null);
	};

	const tagsEqual = (left: TagOption[], right: TagOption[]) => {
		if (left.length !== right.length) return false;
		const leftSet = new Set(left);
		return right.every((tag) => leftSet.has(tag));
	};

	const handleSave = async (event: Event) => {
		event.preventDefault();

		if (!imageForm.name.trim()) {
			toaster.error({
				title: 'Name required',
				description: 'Please provide a name for this image asset.'
			});
			return;
		}

		const isNew = !activeImage;
		if (isNew && !imageForm.imageFile) {
			toaster.error({
				title: 'Image required',
				description: 'Please add an image file before creating a new asset.'
			});
			return;
		}

		try {
			let savedAsset: ImageAsset;
			if (!activeImage) {
				const payload: Partial<ImagePB> & { image?: File | null } = {
					name: imageForm.name.trim(),
					label: imageForm.label.trim() || undefined,
					tags: imageForm.tags
				};

				if (imageForm.imageFile) {
					payload.image = imageForm.imageFile;
				}

				const created = await pbCreateRecord<ImagePB>(COLLECTION_NAMES.Images, payload);
				savedAsset = new ImageAsset(created);
			} else {
				const partial: Partial<ImagePB> & { image?: File | null } = {};

				if (imageForm.name.trim() !== activeImage.name) {
					partial.name = imageForm.name.trim();
				}
				const nextLabel = imageForm.label.trim();
				const currentLabel = activeImage.record.label ?? '';
				if (nextLabel !== currentLabel) {
					partial.label = nextLabel || undefined;
				}
				if (!tagsEqual(imageForm.tags, activeImage.tags)) {
					partial.tags = imageForm.tags;
				}
				if (imageForm.imageFile) {
					partial.image = imageForm.imageFile;
				}

				if (Object.keys(partial).length) {
					await activeImage.updateRecord(partial);
				}
				savedAsset = activeImage;
			}

			const remaining = imageAssets.filter((asset) => asset.id !== savedAsset.id);
			imageAssets = [savedAsset, ...remaining].toSorted((a, b) => a.name.localeCompare(b.name));
			activeImageId = savedAsset.id;
			activeImage = savedAsset;
			imagePreview = savedAsset.imagePath;

			toaster.success({
				title: `Success! ${savedAsset.name} ${isNew ? 'created' : 'updated'}.`
			});
		} catch (error) {
			console.error(error);
			toaster.error({
				title: `Error: ${imageForm.name} failed to ${isNew ? 'save' : 'update'}.`,
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};

	const handleDelete = async (event: Event) => {
		event.preventDefault();
		if (!activeImageId) return;
		const index = imageAssets.findIndex((asset) => asset.id === activeImageId);
		if (index === -1) return;

		try {
			const deleted = imageAssets.splice(index, 1)?.[0];
			await deleted.deleteRecord();
			imageAssets = [...imageAssets];
			startNewImage();
			toaster.success({
				title: 'Image deleted',
				description: deleted.name
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
		<header
			class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm"
		>
			<div class="space-y-1">
				<h1 class="text-2xl font-semibold">Manage Images</h1>
				<p class="text-sm text-surface-700-300">
					Create, edit, and organize the image assets available across the app.
				</p>
			</div>
			<div class="flex flex-wrap gap-2">
			<button type="button" class="btn btn-sm btn-outline" onclick={loadImages}>
				<RefreshCcwIcon class="h-4 w-4" />
				Refresh
			</button>
			<button type="button" class="btn btn-sm btn-primary" onclick={startNewImage}>
				<PlusIcon class="h-4 w-4" />
				New image
			</button>
			</div>
		</header>

		{#if loadError}
			<div class="rounded-2xl border border-rose-200/50 bg-rose-50/50 p-4 text-sm text-rose-700">
				{loadError}
			</div>
		{/if}

		<div class="grid gap-4 lg:grid-cols-[280px_1fr]">
			<aside class="flex flex-col gap-3 rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4">
				<div class="flex items-center justify-between">
					<h2 class="text-sm font-semibold uppercase tracking-wide text-surface-600-300">
						Image Assets
					</h2>
					<span class="text-xs text-surface-500-300">{imageAssets.length}</span>
				</div>
				<div class="flex flex-col gap-2">
					{#if imageAssets.length === 0}
						<p class="text-sm text-surface-500-300">No images available yet.</p>
					{:else}
						{#each imageAssets.toSorted((a, b) => a.name.localeCompare(b.name)) as asset}
							<button
								type="button"
								class={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
									asset.id === activeImageId
										? 'border-primary-500 bg-primary-500/10 text-primary-700'
										: 'border-surface-200-800 bg-surface-100-900/30 hover:bg-surface-100-900/60'
								}`}
								onclick={() => selectImage(asset.id)}
							>
								<span class="truncate">{asset.label}</span>
								<span class="text-xs text-surface-500-300">
									{asset.tags.join(', ') || 'untagged'}
								</span>
							</button>
						{/each}
					{/if}
				</div>
			</aside>

			<section class="rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4">
				<form class="flex flex-col gap-4" onsubmit={handleSave}>
					<div class="flex flex-col gap-1">
						<label class="text-sm font-semibold" for="image-name">Name</label>
						<input
							id="image-name"
							class="input"
							placeholder="Class icon"
							bind:value={imageForm.name}
							required
						/>
						<p class="text-xs text-surface-600-300">Used as the default label and lookup key.</p>
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-sm font-semibold" for="image-label">Label</label>
						<input
							id="image-label"
							class="input"
							placeholder="Display label"
							bind:value={imageForm.label}
						/>
						<p class="text-xs text-surface-600-300">Optional display name shown in UI lists.</p>
					</div>

					<div class="flex flex-col gap-2">
						<label class="text-sm font-semibold" for="image-upload">Image</label>
						<FileUpload
							name="image"
							accept="image/*"
							maxFiles={1}
							onFilesSelected={handleImageAccept}
							ids={{ hiddenInput: 'image-upload' }}
						>
							<FileUpload.Dropzone
								class="group flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-surface-300-700 bg-surface-100-900/30 p-4 text-center"
							>
								{#if imagePreview}
									<img
										class="max-h-40 rounded-lg object-contain"
										src={imagePreview}
										alt="New preview"
									/>
								{:else if imageForm.imagePath}
									<img
										class="max-h-40 rounded-lg object-contain"
										src={imageForm.imagePath}
										alt="Current asset"
									/>
								{:else}
									<p class="text-sm text-surface-600-300">
										Drop an image here, or click to browse.
									</p>
								{/if}
								<FileUpload.HiddenInput accept="image/*" />
							</FileUpload.Dropzone>
						</FileUpload>
						{#if imageForm.imageFile}
							<p class="text-xs text-surface-600-300">Selected: {imageForm.imageFile.name}</p>
						{/if}
					</div>

					<div class="flex flex-col gap-2">
						<p class="text-sm font-semibold">Tags</p>
						<div class="flex flex-wrap gap-3">
							{#each tagOptions as tag}
								<label class="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={imageForm.tags.includes(tag)}
										onchange={() => toggleTag(tag)}
									/>
									<span class="capitalize">{tag}</span>
								</label>
							{/each}
						</div>
						<p class="text-xs text-surface-600-300">Use tags to group images for UI pickers.</p>
					</div>

					<div class="flex flex-wrap gap-2">
						<button type="submit" class="btn btn-primary">
							<SaveIcon class="h-4 w-4" />
							{activeImage ? 'Save changes' : 'Create image'}
						</button>
						<button type="button" class="btn btn-outline" onclick={resetForm}>
							Reset
						</button>
						<button
							type="button"
							class="btn btn-ghost text-rose-600"
							onclick={handleDelete}
							disabled={!activeImage}
						>
							<Trash2Icon class="h-4 w-4" />
							Delete
						</button>
					</div>
				</form>
			</section>
		</div>
	</div>
</div>
