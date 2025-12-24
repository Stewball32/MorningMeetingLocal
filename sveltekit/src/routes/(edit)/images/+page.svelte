<script lang="ts">
	import type { PageData } from './$types';
	import type { ImagePB } from '$lib/pb/schema';
	import { COLLECTION_NAMES, ImageAsset, pbCreateRecord, pbUpdateRecord } from '$lib/pb';
	import { PlusIcon, RefreshCcwIcon, SaveIcon, SearchIcon, Trash2Icon } from '@lucide/svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster';

	type ImageForm = {
		id?: string;
		name: string;
		label: string;
		tags: ImagePB['tags'];
		imagePath: string;
		imageFile: File | null;
	};

	const tagOptions: ImagePB['tags'] = ['guest', 'calendar', 'emotion'];

	let { data }: { data: PageData } = $props();

	let loadError = $state(data.loadError ?? '');
	let imageAssets = $state<ImageAsset[]>(data.imageAssets ?? []);
	let searchTerm = $state('');
	let activeImageId = $state<string | null>(null);
	let activeImage = $state<ImageAsset | null>(null);
	let imageForm = $state<ImageForm>(createEmptyForm());
	let imagePreview = $state('');
	let formError = $state('');

	const createEmptyForm = (): ImageForm => ({
		name: '',
		label: '',
		tags: [],
		imagePath: '',
		imageFile: null
	});

	const mapFromImage = (image: ImageAsset): ImageForm => ({
		id: image.id,
		name: image.name ?? '',
		label: image.record.label ?? '',
		tags: image.tags ?? [],
		imagePath: image.imagePath ?? '',
		imageFile: null
	});

	const normalizeTags = (tags: ImagePB['tags']) => [...tags].sort();
	const tagsEqual = (a: ImagePB['tags'], b: ImagePB['tags']) => {
		const sortedA = normalizeTags(a);
		const sortedB = normalizeTags(b);
		if (sortedA.length !== sortedB.length) return false;
		return sortedA.every((tag, index) => tag === sortedB[index]);
	};

	const visibleImages = $derived.by(() => {
		let next = imageAssets;
		if (searchTerm.trim()) {
			const q = searchTerm.trim().toLowerCase();
			next = next.filter((asset) => {
				const nameMatch = asset.name?.toLowerCase().includes(q);
				const labelMatch = (asset.record.label ?? '').toLowerCase().includes(q);
				const tagMatch = asset.tags?.some((tag) => tag.toLowerCase().includes(q));
				return nameMatch || labelMatch || tagMatch;
			});
		}
		return next.toSorted((a, b) => a.name.localeCompare(b.name));
	});

	$effect(() => {
		if (activeImageId) {
			const current = imageAssets.find((asset) => asset.id === activeImageId);
			if (current) {
				activeImage = current;
				imageForm = mapFromImage(current);
				imagePreview = current.imagePath ?? '';
			} else {
				activeImageId = null;
				activeImage = null;
				imageForm = createEmptyForm();
				imagePreview = '';
			}
		} else {
			activeImage = null;
			imageForm = createEmptyForm();
			imagePreview = '';
		}
		formError = '';
	});

	const selectImage = (id: string) => {
		activeImageId = id;
	};

	const startNewImage = () => {
		activeImageId = null;
		activeImage = null;
		imageForm = createEmptyForm();
		imagePreview = '';
		formError = '';
	};

	const resetForm = () => {
		formError = '';
		if (activeImage) {
			imageForm = mapFromImage(activeImage);
			imagePreview = activeImage.imagePath ?? '';
		} else {
			imageForm = createEmptyForm();
			imagePreview = '';
		}
	};

	const toggleTag = (tag: ImagePB['tags'][number]) => {
		const next = new Set(imageForm.tags);
		if (next.has(tag)) {
			next.delete(tag);
		} else {
			next.add(tag);
		}
		imageForm = { ...imageForm, tags: Array.from(next) as ImagePB['tags'] };
	};

	const setImageFile = (file: File | null) => {
		imageForm.imageFile = file ?? null;
		imagePreview = file ? URL.createObjectURL(file) : imageForm.imagePath;
	};

	const handleImageAccept = (files: File[]) => {
		setImageFile(files?.[0] ?? null);
	};

	const handleSave = async (event: Event) => {
		event.preventDefault();
		formError = '';
		const name = imageForm.name.trim();
		const label = imageForm.label.trim();
		const isNew = !activeImage;
		if (!name) {
			formError = 'Name is required.';
			return;
		}
		if (isNew && !imageForm.imageFile) {
			formError = 'Please upload an image file.';
			return;
		}

		try {
			let nextImage: ImageAsset;
			if (isNew) {
				const created = await pbCreateRecord<ImagePB>(COLLECTION_NAMES.Images, {
					name,
					label: label || undefined,
					tags: imageForm.tags,
					image: imageForm.imageFile as unknown as ImagePB['image']
				});
				nextImage = new ImageAsset(created);
			} else {
				const partial: Partial<ImagePB> = {};
				if (name !== (activeImage.name ?? '')) partial.name = name;
				if ((activeImage.record.label ?? '') !== label) {
					partial.label = label || undefined;
				}
				if (!tagsEqual(imageForm.tags, activeImage.tags ?? [])) {
					partial.tags = imageForm.tags;
				}
				if (Object.keys(partial).length) {
					await activeImage.updateRecord(partial);
				}
				if (imageForm.imageFile) {
					const updated = await pbUpdateRecord<ImagePB>(
						COLLECTION_NAMES.Images,
						activeImage.id,
						{
							image: imageForm.imageFile
						} as Partial<ImagePB>
					);
					activeImage.loadNewRecord(updated);
				}
				nextImage = activeImage;
			}

			const remaining = imageAssets.filter((asset) => asset.id !== nextImage.id);
			imageAssets = [...remaining];
			setTimeout(
				() =>
					(imageAssets = [nextImage, ...remaining].toSorted((a, b) =>
						a.name.localeCompare(b.name)
					)),
				10
			);
			activeImageId = nextImage.id;
			activeImage = nextImage;
			imagePreview = nextImage.imagePath ?? '';
			imageForm = mapFromImage(nextImage);

			toaster.success({
				title: `Success! ${name} ${isNew ? 'created' : 'updated'}.`
			});
		} catch (error) {
			console.error(error);
			toaster.error({
				title: `Error: ${name} failed to ${isNew ? 'save' : 'update'}.`,
				description: error instanceof Error ? error.message : 'Something went wrong.'
			});
		}
	};

	const handleDelete = async (event: Event) => {
		event.preventDefault();
		if (!activeImageId) return;
		const imageIndex = imageAssets.findIndex((asset) => asset.id === activeImageId);
		if (imageIndex === -1) return;
		try {
			const deleted = imageAssets.splice(imageIndex, 1)?.[0];
			await deleted.deleteRecord();
			activeImageId = null;
			activeImage = null;
			imageForm = createEmptyForm();
			imagePreview = '';
			toaster.success({
				title: 'Image deleted',
				description: deleted.name || undefined
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
				<h1 class="text-2xl font-bold">Edit & Add Image Assets</h1>
				<p class="text-sm text-surface-700-300">
					Create reusable image assets with tags, labels, and an image file.
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
					<div class="grid grid-cols-2 items-center gap-2">
						<div class="relative col-span-2">
							<SearchIcon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500-400" />
							<input
								type="search"
								placeholder="Search images"
								class="input w-full rounded-full bg-surface-50-950 pl-10"
								bind:value={searchTerm}
							/>
						</div>
						<button
							type="button"
							onclick={startNewImage}
							class="btn preset-filled-primary-500 col-span-2 flex items-center justify-center gap-2 rounded-full"
						>
							<PlusIcon class="size-4" />
							New Image
						</button>
					</div>

					<div class="max-h-[70vh] space-y-2 overflow-auto pr-1">
						{#if !visibleImages.length}
							<p class="text-sm italic text-surface-700-300">No images match this filter.</p>
						{:else}
							{#each visibleImages as asset}
								<button
									type="button"
									onclick={() => selectImage(asset.id)}
									class={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
										asset.id === activeImageId
											? 'border-primary-400-600 bg-primary-100-900/50'
											: 'border-surface-200-800 hover:border-primary-200 hover:bg-surface-50-950'
									}`}
								>
									<div class="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-surface-200-800 bg-surface-50-950">
										{#if asset.imagePath}
											<img src={asset.imagePath} alt={asset.name} class="h-full w-full object-contain" />
										{:else}
											<div class="flex h-full w-full items-center justify-center text-xs text-surface-500-400">
												No Image
											</div>
										{/if}
									</div>
									<div class="flex flex-1 flex-col">
										<p class="font-semibold leading-5">{asset.name}</p>
										{#if asset.record.label}
											<p class="text-xs text-surface-600-400">{asset.record.label}</p>
										{/if}
									</div>
									{#if asset.tags.length}
										<div class="text-right text-xs text-surface-600-400">
											<p class="rounded-full bg-surface-50-950 px-2 py-0.5">
												{asset.tags.join(', ')}
											</p>
										</div>
									{/if}
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

					{#if formError}
						<div class="rounded-xl border border-warning-500/70 bg-warning-50-950/40 p-3 text-sm text-warning-500">
							{formError}
						</div>
					{/if}

					<form class="space-y-4" onsubmit={handleSave}>
						<div class="grid gap-4 md:grid-cols-[220px_1fr]">
							<div class="flex flex-col items-center gap-3 rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4">
								<label class="text-sm font-semibold" for="image-asset-file">
									Image
								</label>
								<FileUpload
									class="flex flex-col items-center gap-2"
									accept={{ 'image/*': [] }}
									maxFiles={1}
									ids={{ hiddenInput: 'image-asset-file' }}
									onFileAccept={({ files }) => handleImageAccept(files)}
								>
									<FileUpload.Dropzone class="group flex items-center justify-center border-none! bg-transparent! p-0!">
										<div class="flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-surface-200-800 bg-surface-100-900 transition group-data-[dragging=true]:border-primary-500 group-data-[dragging=true]:bg-primary-50-950/60">
											{#if imagePreview}
												<img src={imagePreview} alt="Image preview" class="h-full w-full object-contain" />
											{:else}
												<span class="text-sm text-surface-700-300">Click to Upload</span>
											{/if}
										</div>
										<FileUpload.HiddenInput accept="image/*" />
									</FileUpload.Dropzone>
								</FileUpload>
								{#if imageForm.id}
									<code class="truncate text-[10px] text-surface-700-300">{imageForm.id}</code>
								{/if}
							</div>

							<div class="grid gap-3 sm:grid-cols-2">
								<label class="space-y-1 sm:col-span-2">
									<span class="text-sm font-semibold">Name</span>
									<input
										class="input w-full rounded-full"
										type="text"
										placeholder="Image name"
										bind:value={imageForm.name}
										required
									/>
								</label>

								<label class="space-y-1 sm:col-span-2">
									<span class="text-sm font-semibold">Label</span>
									<input
										class="input w-full rounded-full"
										type="text"
										placeholder="Display label (optional)"
										bind:value={imageForm.label}
									/>
								</label>

								<div class="space-y-2 sm:col-span-2">
									<span class="text-sm font-semibold">Tags</span>
									<div class="flex flex-wrap gap-2">
										{#each tagOptions as tag}
											<button
												type="button"
												class={`btn rounded-full px-4 ${
													imageForm.tags.includes(tag)
														? 'preset-filled-primary-500'
														: 'preset-outlined-surface-200-800'
												}`}
												onclick={() => toggleTag(tag)}
											>
												{tag}
											</button>
										{/each}
									</div>
									{#if !imageForm.tags.length}
										<p class="text-xs text-surface-600-400">No tags selected.</p>
									{/if}
								</div>
							</div>
						</div>
					</form>
				</section>
			</div>
		{/if}
	</div>
</div>
