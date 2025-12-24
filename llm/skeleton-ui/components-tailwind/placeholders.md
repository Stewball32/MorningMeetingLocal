https://www.skeleton.dev/docs/svelte/tailwind-components/placeholders.md
last downloaded 2025-11-30

# Placeholders

Provides "skeleton" placeholders that can display while content loads.

```astro
<div class="w-full space-y-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center justify-center space-x-4">
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-14 animate-pulse"></div>
			<div class="placeholder-circle size-10 animate-pulse"></div>
		</div>
	</div>
	<div class="space-y-4">
		<div class="placeholder animate-pulse"></div>
		<div class="grid grid-cols-4 gap-4">
			<div class="placeholder animate-pulse"></div>
			<div class="placeholder animate-pulse"></div>
			<div class="placeholder animate-pulse"></div>
			<div class="placeholder animate-pulse"></div>
		</div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
	</div>
</div>

```

## Animated

```html
<div class="placeholder animate-pulse">...</div>
```
