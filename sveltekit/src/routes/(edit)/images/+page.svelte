<script lang="ts">
	import type { PageData } from './$types';
	import type { ImagePB } from '$lib/pb/schema';
	import { ImageAsset } from '$lib/pb';
	import { COLLECTION_NAMES } from '$lib/pb/constants';
	import { pbCreateRecord, pbUpdateRecord } from '$lib/pb/core';
	import { PlusIcon, RefreshCcwIcon, SaveIcon, SearchIcon, Trash2Icon } from '@lucide/svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster';

	type TagOption = ImagePB['tags'][number];
	type ImageForm = {
		id?: string;
		name: string;
		label: string;
		tags: TagOption[];
		imageFile: File | null;
		imagePath: string;
	};

	let { data }: { data: PageData } = $props();

	let loadError = $state(data.loadError ?? '');
	let imageAssets = $state<ImageAsset[]>(data.imageAssets ?? []);
	let searchTerm = $state('');
	let activeImageId = $state<string | null>(null);
	let activeImage = $state<ImageAsset | null>(null);
	let imageForm = $state<ImageForm>(createEmptyForm());
	let imagePreview = $state('');

	const tagOptions: TagOption[] = ['guest', 'calendar', 'emotion'];

	function createEmptyForm(): ImageForm {
		return {
			name: '',
			label: '',
			tags: [],
			imageFile: null,
			imagePath: ''
		};
	}

	const mapFromImage = (image: ImageAsset): ImageForm => ({
		id: image.id,
		name: image.name ?? '',
		label: image.label ?? '',
		tags: [...image.tags],
		imageFile: null,
		imagePath: image.imagePath
	});

	const visibleImages = $derived.by(() => {
		let next = imageAssets;
		if (searchTerm.trim()) {
			const q = searchTerm.trim().toLowerCase();
			next = next.filter(
				(image) =>
					(image.name ?? '').toLowerCase().includes(q) ||
					(image.label ?? '').toLowerCase().includes(q)
			);
		}
		return next.toSorted((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
	});

	$effect(() => {
		if (activeImageId) {
			const current = imageAssets.find((image) => image.id === activeImageId);
			if (current) {
				activeImage = current;
				imageForm = mapFromImage(current);
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

	const selectImage = (id: string) => {
		activeImageId = id;
	};

	const startNewImage = () => {
		activeImageId = null;
		activeImage = null;
		imageForm = createEmptyForm();
		imagePreview = '';
	};

	const resetForm = () => {
		if (activeImageId) {
			const current = imageAssets.find((image) => image.id === activeImageId);
			imageForm = current ? mapFromImage(current) : createEmptyForm();
		} else {
			imageForm = createEmptyForm();
		}
		imagePreview = '';
	};

	const resetImageFile = () => {
		imageForm = {
			...imageForm,
			imageFile: null,
			imagePath: activeImage?.imagePath ?? imageForm.imagePath
		};
		imagePreview = '';
	};

	const setImageFile = (file: File | null) => {
		imageForm = { ...imageForm, imageFile: file };
		imagePreview = file ? URL.createObjectURL(file) : '';
	};

	const handleImageAccept = (files: File[]) => {
		setImageFile(files?.[0] ?? null);
	};

	const toggleTag = (tag: TagOption) => {
		const next = new Set(imageForm.tags);
		if (next.has(tag)) {
			next.delete(tag);
		} else {
			next.add(tag);
		}
		imageForm = { ...imageForm, tags: Array.from(next) };
	};

	const upsertImage = (asset: ImageAsset) => {
		const next = imageAssets.filter((image) => image.id !== asset.id);
		imageAssets = [asset, ...next].toSorted((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
		activeImageId = asset.id;
		activeImage = asset;
		imagePreview = '';
	};

	const handleSave = async (event: Event) => {
		event.preventDefault();
		const isNew = !activeImage;
		try {
			const trimmedName = imageForm.name.trim();
			if (!trimmedName) throw new Error('Name is required.');
			if (!activeImage && !imageForm.imageFile) {
				throw new Error('Choose an image file for new assets.');
			}

			if (!activeImage) {
				const record = await pbCreateRecord<ImagePB>(COLLECTION_NAMES.Images, {
					name: trimmedName,
					label: imageForm.label.trim() || undefined,
					tags: imageForm.tags,
					image: imageForm.imageFile
				});
				upsertImage(new ImageAsset(record));
				toaster.success({ title: `Image "${trimmedName}" created.` });
				return;
			}

			const updatedRecord = await pbUpdateRecord<ImagePB>(
				activeImage.collectionId,
				activeImage.id,
				{
					name: trimmedName,
					label: imageForm.label.trim(),
					tags: imageForm.tags,
					...(imageForm.imageFile ? { image: imageForm.imageFile } : {})
				}
			);
			activeImage.loadNewRecord(updatedRecord);
			upsertImage(activeImage);
			toaster.success({ title: `Image "${trimmedName}" updated.` });
		} catch (error) {
			console.error(error);
			toaster.error({
				title: 'Save failed',
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};

	const handleDelete = async (event: Event) => {
		event.preventDefault();
		if (!activeImageId) return;
		const imageIndex = imageAssets.findIndex((image) => image.id === activeImageId);
		if (imageIndex === -1) return;
		try {
			const [deletedImage] = imageAssets.splice(imageIndex, 1);
			await deletedImage.deleteRecord();
			imageAssets = [...imageAssets];
			startNewImage();
			toaster.success({
				title: 'Image deleted',
				description: deletedImage.name
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
				<p class="text-sm uppercase tracking-wide text-surface-700-300">Images</p>
				<h1 class="text-2xl font-bold">Manage Image Assets</h1>
				<p class="text-sm text-surface-700-300">
					Create, update, and tag the images used across the app.
				</p>
			</div>
		</header>

		{#if loadError}
			<div class="card border border-error-500 bg-error-50-950/60 p-4">
				<p class="font-semibold text-error-500">Could not load image assets</p>
				<p class="text-sm text-error-500/90">{loadError}</p>
			</div>
		{:else}
			<div class="grid gap-4 lg:grid-cols-[360px_1fr]">
				<section class="flex h-full flex-col gap-3 rounded-2xl border border-surface-200-800 bg-surface-100-900/70 p-4 shadow-sm">
					<div class="flex flex-wrap items-center gap-2">
						<div class="relative flex-1">
							<SearchIcon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500-400" />
							<input
								type="search"
								placeholder="Filter by name or label"
								class="input w-full rounded-full bg-surface-50-950 pl-10"
								bind:value={searchTerm}
							/>
						</div>
						<button
							type="button"
							class="btn preset-filled-primary-500 flex items-center gap-2 rounded-full"
							onclick={startNewImage}
						>
							<PlusIcon class="size-4" />
							New
						</button>
					</div>

					<div class="flex flex-col gap-2">
						{#if visibleImages.length === 0}
							<p class="text-sm text-surface-700-300">No images match this search.</p>
						{:else}
							{#each visibleImages as image}
								<button
									type="button"
									class={`group flex items-center gap-3 rounded-xl border p-3 text-left transition ${
										image.id === activeImageId
											? 'border-primary-500 bg-primary-50-950/40'
											: 'border-surface-200-800 bg-surface-50-950/60 hover:border-primary-400'
									}`}
									onclick={() => selectImage(image.id)}
								>
									<div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-surface-200-800 bg-surface-100-900">
										{#if image.imagePath}
											<img src={image.imagePath} alt={image.label} class="h-full w-full object-contain" />
										{:else}
											<span class="text-xs text-surface-500-400">No image</span>
										{/if}
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-semibold">{image.name}</p>
										<p class="truncate text-xs text-surface-700-300">{image.label}</p>
										<div class="mt-1 flex flex-wrap gap-1">
											{#each image.tags as tag}
												<span class="rounded-full bg-surface-200-800 px-2 py-0.5 text-[10px] uppercase tracking-wide">
													{tag}
												</span>
											{/each}
										</div>
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
								{activeImageId ? 'Editing existing image' : 'Creating new image'}
							</p>
							<h2 class="text-xl font-semibold">
								{imageForm.name || 'Untitled image'}
							</h2>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<button
								type="button"
								class="btn preset-filled-success-500 flex items-center gap-2 rounded-full px-3"
								onclick={handleSave}
							>
								<SaveIcon class="size-4" />
								{imageForm.id ? 'Update' : 'Save'}
							</button>
							<button
								type="button"
								class="btn preset-outlined-warning-500 flex items-center gap-2 rounded-full px-3"
								onclick={resetForm}
							>
								<RefreshCcwIcon class="size-4" />
								{imageForm.id ? 'Reset' : 'Clear'}
							</button>
							<button
								type="button"
								class="btn preset-outlined-error-500 flex items-center gap-2 rounded-full px-3"
								onclick={handleDelete}
								disabled={!activeImageId}
							>
								<Trash2Icon class="size-4" />
								Delete
							</button>
						</div>
					</div>

					<form class="space-y-4" onsubmit={handleSave}>
						<div class="grid gap-4 lg:grid-cols-[240px_1fr]">
							<div class="flex flex-col items-center gap-3 rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4">
								<label class="text-sm font-semibold" for="image-file">
									Image
								</label>
								<FileUpload
									class="flex flex-col items-center gap-2"
									accept={{ 'image/*': [] }}
									maxFiles={1}
									ids={{ hiddenInput: 'image-file' }}
									onFileAccept={({ files }) => handleImageAccept(files)}
								>
									<FileUpload.Dropzone class="group flex items-center justify-center p-0! border-none! bg-transparent!">
										<div class="flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-surface-200-800 bg-surface-100-900 text-xs text-surface-500-400 transition group-data-[dragging=true]:border-primary-500 group-data-[dragging=true]:bg-primary-50-950/60">
											{#if imagePreview}
											<img src={imagePreview} alt="New preview" class="h-full w-full object-contain" />
										{:else if imageForm.imagePath}
											<img src={imageForm.imagePath} alt="Current asset" class="h-full w-full object-contain" />
										{:else}
												<span>Click to upload</span>
											{/if}
										</div>
										<FileUpload.HiddenInput accept="image/*" />
									</FileUpload.Dropzone>
								</FileUpload>
								{#if imageForm.imageFile}
									<button
										type="button"
										class="btn preset-outlined-warning-500 rounded-full px-3"
										onclick={resetImageFile}
									>
										Clear selection
									</button>
								{/if}
								{#if imageForm.id}
									<code class="truncate text-[10px] text-surface-700-300">{imageForm.id}</code>
								{/if}
							</div>

							<div class="grid gap-3">
								<label class="space-y-1">
									<span class="text-sm font-semibold">Name</span>
									<input
										class="input w-full rounded-full"
										type="text"
										bind:value={imageForm.name}
										required
									/>
								</label>
								<label class="space-y-1">
									<span class="text-sm font-semibold">Label</span>
									<input
										class="input w-full rounded-full"
										type="text"
										placeholder="Display label (optional)"
										bind:value={imageForm.label}
									/>
								</label>
								<div class="space-y-2">
									<span class="text-sm font-semibold">Tags</span>
									<div class="flex flex-wrap gap-2">
										{#each tagOptions as tag}
											<label class="flex items-center gap-2 rounded-full border border-surface-200-800 bg-surface-50-950 px-3 py-1 text-xs uppercase tracking-wide">
												<input
													type="checkbox"
													class="checkbox"
													checked={imageForm.tags.includes(tag)}
													onchange={() => toggleTag(tag)}
												/>
												<span>{tag}</span>
											</label>
										{/each}
									</div>
								</div>
							</div>
						</div>
					</form>
				</section>
			</div>
		{/if}
	</div>
</div>
