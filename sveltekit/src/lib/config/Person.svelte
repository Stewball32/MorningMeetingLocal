<script lang="ts">
	import type { ImageAsset } from '$lib/pb/objects';
	import type {
		PersonConfig,
		PersonQuestionNumber,
		PersonQuestionString,
		PersonRating
	} from '$lib/pb/schema';
	import {
		AngryIcon,
		CheckIcon,
		FrownIcon,
	LaughIcon,
	MehIcon,
	SmileIcon,
	ThumbsDownIcon,
	ThumbsUpIcon,
	XIcon
} from '@lucide/svelte';
	import { Avatar, Listbox, RatingGroup, useListCollection } from '@skeletonlabs/skeleton-svelte';

	type FilledConfig = PersonConfig & {
		poll: { num: PersonQuestionNumber; str: PersonQuestionString };
		quiz: { num: PersonQuestionNumber; str: PersonQuestionString };
		rating: PersonRating;
		video: { id: string; start?: number; end?: number };
	};

	let {
    title,
    subtitle,
		config,
		imageAssets,
		onConfigChange
	}: {
    title: string,
    subtitle: string,
		config: FilledConfig;
		imageAssets: ImageAsset[];
		onConfigChange?: (config: FilledConfig) => void;
	} = $props();

	const ratingOptionChoices: Record<PersonConfig['rating']['type'], number[]> = {
		smileys: [2, 3, 5],
		thumbs: [2],
		yesno: [2],
		scale: [5, 10]
	};

	const ratingButtonBase =
		'btn rounded-lg px-3 py-2 text-sm flex items-center justify-center gap-2 preset-outlined-surface-200-800 h-12';

	const emotionCollection = useListCollection({
		items: imageAssets,
		itemToString: (item) => item.label,
		itemToValue: (item) => item.id
	});

	$effect(() => {
		emotionCollection.items = imageAssets;
	});

	const updateConfig = (next: FilledConfig) => {
		onConfigChange?.(next);
	};

	const getDefaultRatingOptions = (type: PersonConfig['rating']['type']) => {
		if (type === 'smileys') return 3;
		if (type === 'scale') return 5;
		if (type === 'thumbs' || type === 'yesno') return 2;
		return undefined;
	};

	const getSmileyIconColor = (idx: number, total: number) => {
		const red = 'text-red-700 dark:text-red-300';
		const yellow = 'text-yellow-700 dark:text-yellow-300';
		const green = 'text-green-700 dark:text-green-300';
		if (total === 2) return idx === 0 ? red : green;
		if (total === 3) return [red, yellow, green][idx] ?? green;
		return [red, red, yellow, green, green][idx] ?? green;
	};

	const getSmileyIcon = (idx: number, total: number) => {
		if (total === 2) {
			return idx === 0 ? FrownIcon : SmileIcon;
		}
		if (total === 3) {
			return [FrownIcon, MehIcon, SmileIcon][idx] ?? SmileIcon;
		}
		return [AngryIcon, FrownIcon, MehIcon, SmileIcon, LaughIcon][idx] ?? SmileIcon;
	};

	const updatePollQuiz = (
		path: 'poll' | 'quiz',
		key: 'num' | 'str',
		field: 'type' | 'options',
		value: any
	) => {
		const target = config[path][key];
		const updatedTarget =
			field === 'type'
				? { ...target, type: value as typeof target.type }
				: { ...target, options: value as typeof target.options };

		updateConfig({
			...config,
			[path]: {
				...config[path],
				[key]: updatedTarget
			}
		});
	};

	const updateRating = (type: PersonConfig['rating']['type'], options?: number) => {
		const allowed = ratingOptionChoices[type];
		const fallback = getDefaultRatingOptions(type);
		const nextOptions =
			allowed.length === 0
				? fallback
				: options && allowed.includes(options)
					? options
					: fallback;
		updateConfig({
			...config,
			rating: { type, options: nextOptions }
		});
	};

	const updateEmotions = (values: string[]) => {
		updateConfig({
			...config,
			emotions: values
		});
	};
</script>

<div class="rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4 space-y-4">
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-semibold">{title}</h3>
		<p class="text-xs text-surface-700-300">{subtitle}</p>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2 rounded-xl border border-surface-200-800 bg-surface-100-900 p-3">
			<p class="font-medium">Polls</p>
			<label class="space-y-1">
				<span class="text-sm text-surface-700-300">Numbers</span>
				<div class="flex gap-2">
					<select
						class="select flex-1 rounded-full"
						onchange={(e) =>
							updatePollQuiz('poll', 'num', 'type', (e.currentTarget as HTMLSelectElement).value)}
						value={config.poll.num.type}
					>
						<option value="multi">Multiple choice</option>
						<option value="numpad">Number pad</option>
					</select>
					<input
						class="input w-16 rounded-full text-center"
						type="number"
						min="1"
						max="9"
						disabled={config.poll.num.type != 'multi'}
						onchange={(e) =>
							updatePollQuiz(
								'poll',
								'num',
								'options',
								Number((e.currentTarget as HTMLInputElement).value)
							)}
						value={config.poll.num.options ?? ''}
					/>
				</div>
			</label>
			<label class="space-y-1">
				<span class="text-sm text-surface-700-300">Words</span>
				<div class="flex gap-2">
					<select
						class="select flex-1 rounded-full"
						onchange={(e) =>
							updatePollQuiz('poll', 'str', 'type', (e.currentTarget as HTMLSelectElement).value)}
						value={config.poll.str.type}
					>
						<option value="multi">Multiple choice</option>
						<option value="abc">ABC keypad</option>
						<option value="qwerty">QWERTY keypad</option>
					</select>
					<input
						class="input w-16 rounded-full text-center"
						type="number"
						min="1"
						max="9"
						disabled={config.poll.str.type != 'multi'}
						onchange={(e) =>
							updatePollQuiz(
								'poll',
								'str',
								'options',
								Number((e.currentTarget as HTMLInputElement).value)
							)}
						value={config.poll.str.options ?? ''}
					/>
				</div>
			</label>
		</div>

		<div class="space-y-2 rounded-xl border border-surface-200-800 bg-surface-100-900 p-3">
			<p class="font-medium">Quizzes</p>
			<label class="space-y-1">
				<span class="text-sm text-surface-700-300">Numbers</span>
				<div class="flex gap-2">
					<select
						class="select flex-1 rounded-full"
						onchange={(e) =>
							updatePollQuiz('quiz', 'num', 'type', (e.currentTarget as HTMLSelectElement).value)}
						value={config.quiz.num.type}
					>
						<option value="multi">Multiple choice</option>
						<option value="numpad">Number pad</option>
					</select>
					<input
						class="input w-16 rounded-full text-center"
						type="number"
						min="1"
						max="9"
						disabled={config.quiz.num.type != 'multi'}
						onchange={(e) =>
							updatePollQuiz(
								'quiz',
								'num',
								'options',
								Number((e.currentTarget as HTMLInputElement).value)
							)}
						value={config.quiz.num.options ?? ''}
					/>
				</div>
			</label>
			<label class="space-y-1">
				<span class="text-sm text-surface-700-300">Words</span>
				<div class="flex gap-2">
					<select
						class="select flex-1 rounded-full"
						onchange={(e) =>
							updatePollQuiz('quiz', 'str', 'type', (e.currentTarget as HTMLSelectElement).value)}
						value={config.quiz.str.type}
					>
						<option value="multi">Multiple choice</option>
						<option value="abc">ABC keypad</option>
						<option value="qwerty">QWERTY keypad</option>
					</select>
					<input
						class="input w-16 rounded-full text-center"
						type="number"
						min="1"
						max="9"
						disabled={config.quiz.str.type != 'multi'}
						onchange={(e) =>
							updatePollQuiz(
								'quiz',
								'str',
								'options',
								Number((e.currentTarget as HTMLInputElement).value)
							)}
						value={config.quiz.str.options ?? ''}
					/>
				</div>
			</label>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-[2fr_1fr]">
		<div class="space-y-2 rounded-xl border border-surface-200-800 bg-surface-100-900 p-3">
			<p class="font-medium">Rating</p>
			<div class="grid gap-2 sm:grid-cols-[1fr_auto]">
				<select
					class="select rounded-full"
					value={config.rating.type}
					onchange={(e) =>
						updateRating((e.currentTarget as HTMLSelectElement).value as PersonConfig['rating']['type'])}
				>
					<option value="smileys">Smileys</option>
					<option value="thumbs">Thumbs</option>
					<option value="yesno">Yes / No</option>
					<option value="scale">Scale</option>
				</select>
				{#if ratingOptionChoices[config.rating.type].length}
					<select
						class="select rounded-full"
						value={`${
							config.rating.options ??
							getDefaultRatingOptions(config.rating.type) ??
							ratingOptionChoices[config.rating.type][0] ??
							''
						}`}
						disabled={config.rating.type === 'thumbs' || config.rating.type === 'yesno'}
						onchange={(e) =>
							updateRating(
								config.rating.type,
								Number((e.currentTarget as HTMLSelectElement).value || undefined)
							)}
					>
						{#each ratingOptionChoices[config.rating.type] as opt}
							<option value={`${opt}`}>{opt}</option>
						{/each}
					</select>
				{/if}
			</div>

			<div class="rounded-xl border border-surface-200-800 bg-surface-50-950 p-3">
				<p class="text-xs uppercase tracking-wide text-surface-700-300">Preview</p>
				{#if config.rating.type === 'thumbs'}
					<div class="mt-2 flex items-center gap-2">
						<button type="button" class={ratingButtonBase}>
							<ThumbsUpIcon class="size-5 text-green-700 dark:text-green-300" />
						</button>
						<button type="button" class={ratingButtonBase}>
							<ThumbsDownIcon class="size-5 text-red-700 dark:text-red-300" />
						</button>
					</div>
				{:else if config.rating.type === 'yesno'}
					<div class="mt-2 flex items-center gap-2">
						<button type="button" class={ratingButtonBase}>
							<CheckIcon class="size-5 text-green-700 dark:text-green-300" />
						</button>
						<button type="button" class={ratingButtonBase}>
							<XIcon class="size-5 text-red-700 dark:text-red-300" />
						</button>
					</div>
				{:else if config.rating.type === 'smileys'}
					<div class="mt-2 flex items-center gap-2">
						{#each Array(config.rating.options ?? 3) as _, idx}
							{@const Icon = getSmileyIcon(idx, config.rating.options ?? 3)}
							<button type="button" class={ratingButtonBase}>
								<Icon class={`size-6 ${getSmileyIconColor(idx, config.rating.options ?? 3)}`} />
							</button>
						{/each}
					</div>
				{:else if config.rating.type === 'scale'}
					<div class="mt-2">
						<RatingGroup
							count={config.rating.options ?? 5}
							allowHalf={false}
							value={config.rating.options === 10 ? 8 : 3}
							class="inline-flex text-warning-500 dark:text-warning-300"
						>
							<RatingGroup.Control>
								<RatingGroup.Context>
									{#snippet children(ratingGroup)}
										{#each ratingGroup().items as index (index)}
											<RatingGroup.Item {index} />
										{/each}
									{/snippet}
								</RatingGroup.Context>
							</RatingGroup.Control>
						</RatingGroup>
					</div>
				{/if}
			</div>
		</div>

		<div class="space-y-2 rounded-xl border border-surface-200-800 bg-surface-100-900 p-3">
			<p class="font-medium">Emotions</p>
			<p class="text-xs text-surface-700-300">Comma separated IDs or tags.</p>
			<Listbox
				class="w-full max-h-48 overflow-y-auto"
				collection={emotionCollection}
				selectionMode="multiple"
				value={config.emotions}
				onValueChange={({ value }) => updateEmotions(value ?? [])}
			>
				<Listbox.Content>
					{#each emotionCollection.items as item (item.id)}
						<Listbox.Item {item}>
							<Listbox.ItemText>
								<div class="flex items-center gap-2">
									<Avatar class="size-6 shrink-0 bg-surface-200-800">
										<Avatar.Image
											src={item.imagePath}
											alt={item.name}
											class="h-full w-full object-contain"
										/>
										<Avatar.Fallback class="text-xs font-semibold text-surface-500-400">
                      {item.name?.slice(0, 2)?.toUpperCase() ?? ''}
										</Avatar.Fallback>
									</Avatar>
									<span>{item.name}</span>
								</div>
							</Listbox.ItemText>
							<Listbox.ItemIndicator />
						</Listbox.Item>
					{/each}
				</Listbox.Content>
			</Listbox>
		</div>
	</div>
</div>
