<script lang="ts">
	import type { ImageAsset } from '$lib/pb/objects';
	import type {
		PersonConfig,
		PersonQuestionNumber,
		PersonQuestionString,
		PersonRating
	} from '$lib/pb/schema';
	import PersonConfigPanel from '$lib/config/Person.svelte';

	type FilledPersonConfig = PersonConfig & {
		poll: { num: PersonQuestionNumber; str: PersonQuestionString };
		quiz: { num: PersonQuestionNumber; str: PersonQuestionString };
		rating: PersonRating;
		video: { id: string; start?: number; end?: number };
	};

	export type ClassroomConfig = Record<string, any> & {
		personDefaults?: FilledPersonConfig;
	};

	let {
		config,
		imageAssets = [],
		onConfigChange
	}: {
		config?: ClassroomConfig;
		imageAssets?: ImageAsset[];
		onConfigChange?: (config: ClassroomConfig) => void;
	} = $props();

	const defaultPersonConfig: FilledPersonConfig = {
		emotions: [],
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

	const mergePersonConfig = (incoming?: PersonConfig): FilledPersonConfig => ({
		...defaultPersonConfig,
		emotions: incoming?.emotions ?? defaultPersonConfig.emotions,
		poll: {
			num: incoming?.poll?.num ?? defaultPersonConfig.poll.num,
			str: incoming?.poll?.str ?? defaultPersonConfig.poll.str
		},
		quiz: {
			num: incoming?.quiz?.num ?? defaultPersonConfig.quiz.num,
			str: incoming?.quiz?.str ?? defaultPersonConfig.quiz.str
		},
		rating: incoming?.rating ?? defaultPersonConfig.rating,
		video: incoming?.video ?? defaultPersonConfig.video
	});

	const stripPersonDefaults = (cfg: ClassroomConfig | undefined) => {
		if (!cfg || typeof cfg !== 'object') return {};
		const { personDefaults, ...rest } = cfg;
		return rest;
	};

	const formatExtras = (cfg: ClassroomConfig | undefined) => {
		const extras = stripPersonDefaults(cfg);
		return Object.keys(extras).length ? JSON.stringify(extras, null, 2) : '';
	};

	let personDefaults = $state<FilledPersonConfig>(mergePersonConfig(config?.personDefaults));
	let extraConfigText = $state<string>(formatExtras(config));
	let extrasError = $state('');

	const emitConfig = (extras: Record<string, any>, defaults: FilledPersonConfig = personDefaults) => {
		onConfigChange?.({
			...extras,
			personDefaults: defaults
		});
	};

	const placeholderExtras = `{
  "weekTheme": "Earth",
  "maxGroups": 4
}`;

	const parseExtras = (value: string): Record<string, any> | null => {
		if (!value.trim()) {
			extrasError = '';
			return {};
		}

		try {
			const parsed = JSON.parse(value);
			if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
				extrasError = 'Additional config must be a JSON object.';
				return null;
			}
			extrasError = '';
			return stripPersonDefaults(parsed);
		} catch (error) {
			extrasError = 'Additional config must be valid JSON.';
			return null;
		}
	};

	const handleExtrasInput = (value: string) => {
		extraConfigText = value;
		const parsed = parseExtras(value);
		if (parsed) emitConfig(parsed, personDefaults);
	};

	const handlePersonDefaultsChange = (next: FilledPersonConfig) => {
		personDefaults = next;
		const extras = parseExtras(extraConfigText);
		if (extras) emitConfig(extras, next);
	};

	$effect(() => {
		personDefaults = mergePersonConfig(config?.personDefaults);
		extraConfigText = formatExtras(config);
		extrasError = '';
	});
</script>

<div class="rounded-2xl border border-surface-200-800 bg-surface-50-950 p-4 space-y-4">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold">Settings</h3>
			<p class="text-xs text-surface-700-300">
				Defaults stored on the classroom record. Person defaults apply when the person has no config.
			</p>
		</div>
	</div>


			<PersonConfigPanel
        title="Person"
        subtitle="The default parameters for on screen interactions."
				config={personDefaults}
        {imageAssets}
				onConfigChange={handlePersonDefaultsChange}
			/>


</div>
