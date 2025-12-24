https://www.skeleton.dev/docs/svelte/tailwind-components/chips
last downloaded 2025-11-30

# Chips

Provides a robust set of interactive chip styles.

```astro
---
import { CheckIcon } from 'lucide-react';
---

<div class="flex items-center gap-4">
	<!-- A simple icon chip -->
	<button type="button" class="chip-icon preset-filled">
		<CheckIcon size={16} />
	</button>
	<!-- A standard chip -->
	<button type="button" class="chip preset-filled">Chip</button>
	<!-- A chip + icon -->
	<button type="button" class="chip preset-filled">
		<span>Chip</span>
		<CheckIcon size={16} />
	</button>
</div>

```

## Presets

Provides full support of [Presets](/docs/[framework]/design/presets).

```astro
<div class="space-y-4">
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-primary-500">Chip</button>
		<button type="button" class="chip preset-tonal-primary">Chip</button>
		<button type="button" class="chip preset-outlined-primary-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-secondary-500">Chip</button>
		<button type="button" class="chip preset-tonal-secondary">Chip</button>
		<button type="button" class="chip preset-outlined-secondary-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-tertiary-500">Chip</button>
		<button type="button" class="chip preset-tonal-tertiary">Chip</button>
		<button type="button" class="chip preset-outlined-tertiary-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-success-500">Chip</button>
		<button type="button" class="chip preset-tonal-success">Chip</button>
		<button type="button" class="chip preset-outlined-success-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-warning-500">Chip</button>
		<button type="button" class="chip preset-tonal-warning">Chip</button>
		<button type="button" class="chip preset-outlined-warning-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-error-500">Chip</button>
		<button type="button" class="chip preset-tonal-error">Chip</button>
		<button type="button" class="chip preset-outlined-error-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-surface-500">Chip</button>
		<button type="button" class="chip preset-tonal-surface">Chip</button>
		<button type="button" class="chip preset-outlined-surface-500">Chip</button>
	</div>
</div>

```

## Disabled

When applied to a `<button>` element, you can use the `disabled` attribute.

```astro
<button type="button" class="chip preset-filled" disabled>Chip</button>

```

## Selection

```svelte
<script lang="ts">
	const colors = ['red', 'blue', 'green'];
	let color = $state(colors[0]);

	function setColor(selectedColor: string) {
		color = selectedColor;
	}
</script>

<div class="flex gap-2">
	<!-- Loop through the available colors -->
	{#each colors as c (c)}
		<!-- On selection, set the color state, dynamically update classes -->
		<button class={`chip capitalize ${color === c ? 'preset-filled' : 'preset-tonal'}`} onclick={() => setColor(c)}>
			<span>{c}</span>
		</button>
	{/each}
</div>

```
