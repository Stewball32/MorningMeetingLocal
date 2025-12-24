<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import type { Person } from '$lib/pb';

	interface Props {
		person: Person;
		orientation?: 'horizontal' | 'vertical';
		class?: string;
		overrideClass?: string;
		showAvatar?: boolean;
		showName?: boolean;
		buttonPreset?:
			| 'primary'
			| 'secondary'
			| 'tertiary'
			| 'success'
			| 'warning'
			| 'error'
			| 'surface';
		disableButton?: boolean;
		draggable?: boolean;
		onclick?: () => void;
	}

	const {
		person,
		class: btnClass = '',
		overrideClass = 'rounded-full border-2',
		orientation = 'horizontal',
		showAvatar = true,
		showName = true,
		buttonPreset = 'surface',
		disableButton,
		draggable = true,
		onclick = () => {}
	}: Props = $props();

	const presets = {
		primary: 'preset-tonal-primary border-primary-700-300',
		secondary: 'preset-tonal-secondary border-secondary-700-300',
		tertiary: 'preset-tonal-tertiary border-tertiary-700-300',
		success: 'preset-tonal-success border-success-700-300',
		warning: 'preset-tonal-warning border-warning-700-300',
		error: 'preset-tonal-error border-error-700-300',
		surface: 'preset-tonal-surface border-surface-700-300'
	};

	const buttonClass = $derived(
		`btn flex select-all items-center justify-center overflow-hidden cursor-pointer pointer-none disabled:pointer-not-allowed hover:scale-105 active:scale-95 ${presets[buttonPreset] ?? ''}  ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'} ${overrideClass} ${btnClass}`
	);
</script>

<button {draggable} class={buttonClass} disabled={disableButton} {onclick}>
	{#if showAvatar && person.avatarPath}
		<Avatar
			src={person.avatarPath}
			name={person.name}
			base=""
			background=""
			size="h-full"
			font="abeezee"
			border=""
			rounded=""
			shadow=""
			classes=""
			imageBase=""
			imageClasses="aspect-auto h-full w-auto select-none"
			fallbackBase=""
			fallbackClasses=""
		/>
		<!-- <img
			class="aspect-auto h-full w-auto select-none"
			src={person.avatarPath}
			alt={person.name || 'Person Avatar'}
		/> -->
	{/if}
	{#if showName}
		<span class=" select-none">{person.name}</span>
	{/if}
</button>
