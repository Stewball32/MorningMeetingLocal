https://www.skeleton.dev/docs/svelte/framework-components/navigation.md
last downloaded 2025-11-30

# Navigation

Navigation patterns for apps (bar, rail, sidebar, toggle).

## Bar

```svelte
<script lang="ts">
	import { BikeIcon, BookIcon, HouseIcon, TreePalmIcon } from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const links = [
		{ label: 'Home', href: '#', icon: HouseIcon },
		{ label: 'Entertainment', href: '#', icon: BookIcon },
		{ label: 'Recreation', href: '#', icon: BikeIcon },
		{ label: 'Relaxation', href: '#', icon: TreePalmIcon },
	];
	let anchorBar = 'btn hover:preset-tonal flex-col items-center gap-1';
</script>

<div class="w-[375px] h-[667px] grid grid-rows-[1fr_auto] border border-surface-200-800">
	<div class="flex justify-center items-center">
		<p>Contents</p>
	</div>
	<!-- --- -->
	<Navigation layout="bar">
		<Navigation.Menu class="grid grid-cols-4 gap-2">
			{#each links as link (link)}
				{@const Icon = link.icon}
				<a href={link.href} class={anchorBar}>
					<Icon class="size-5" />
					<span class="text-[10px]">{link.label}</span>
				</a>
			{/each}
		</Navigation.Menu>
	</Navigation>
	<!-- --- -->
</div>

```

- Recommended for small sized screens (ex: mobile).
- Ideal for vertical screen layouts.
- Should be fixed to the bottom of the viewport.
- Supports 3-5 tiles based on contents and viewport width.
- Consider progressive enhancement with the [Virtual Keyboard API](https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API).

## Rail

```svelte
<script lang="ts">
	import { BikeIcon, BookIcon, HouseIcon, SettingsIcon, SkullIcon, TreePalmIcon } from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const links = [
		{ label: 'Home', href: '#', icon: HouseIcon },
		{ label: 'Entertainment', href: '#', icon: BookIcon },
		{ label: 'Recreation', href: '#', icon: BikeIcon },
		{ label: 'Relaxation', href: '#', icon: TreePalmIcon },
	];
	let anchorRail = 'btn hover:preset-tonal aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5';
</script>

<div class="w-full h-[640px] grid grid-cols-[auto_1fr] border border-surface-200-800">
	<!-- --- -->
	<Navigation layout="rail">
		<Navigation.Header>
			<a href="/" class={anchorRail} title="View Homepage" aria-label="View Homepage">
				<SkullIcon class="size-8" />
			</a>
		</Navigation.Header>
		<Navigation.Content>
			<Navigation.Menu>
				{#each links as link (link)}
					{@const Icon = link.icon}
					<a href={link.href} class={anchorRail}>
						<Icon class="size-5" />
						<span class="text-xs">{link.label}</span>
					</a>
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
		<Navigation.Footer>
			<a href="#" class={anchorRail} title="Settings" aria-label="Settings">
				<SettingsIcon class="size-5" />
			</a>
		</Navigation.Footer>
	</Navigation>
	<!-- --- -->
	<div class="flex justify-center items-center">
		<p class="opacity-50">Contents</p>
	</div>
</div>

```

- Recommended for medium sized screens (ex: tablet).
- Ideal for horizontal screen layouts.
- Should be fixed to the left or right of the viewport.
- Supports 3-7 tiles based on contents and viewport height.

## Sidebar

```svelte
<script lang="ts">
	import {
		BedDoubleIcon,
		BikeIcon,
		BookIcon,
		BubblesIcon,
		HouseIcon,
		MountainIcon,
		PopcornIcon,
		SailboatIcon,
		SettingsIcon,
		SkullIcon,
		TreePalmIcon,
		TvIcon,
	} from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const linksSidebar = {
		entertainment: [
			{ label: 'Books', href: '#', icon: BookIcon },
			{ label: 'Movies', href: '#', icon: PopcornIcon },
			{ label: 'Television', href: '#', icon: TvIcon },
		],
		recreation: [
			{ label: 'Biking', href: '#', icon: BikeIcon },
			{ label: 'Sailing', href: '#', icon: SailboatIcon },
			{ label: 'Hiking', href: '#', icon: MountainIcon },
		],
		relaxation: [
			{ label: 'Lounge', href: '#', icon: TreePalmIcon },
			{ label: 'Spa', href: '#', icon: BubblesIcon },
			{ label: 'Sleep', href: '#', icon: BedDoubleIcon },
		],
	};

	let anchorSidebar = 'btn hover:preset-tonal justify-start px-2 w-full';
</script>

<div class="w-full h-[728px] grid grid-cols-[auto_1fr] items-stretch border border-surface-200-800">
	<!-- --- -->
	<Navigation layout="sidebar" class="grid grid-rows-[auto_1fr_auto] gap-4">
		<Navigation.Header>
			<a href="https://www.skeleton.dev" class="btn-icon btn-icon-lg preset-filled-primary-500">
				<SkullIcon class="size-6" />
			</a>
		</Navigation.Header>
		<Navigation.Content>
			<Navigation.Group>
				<Navigation.Menu>
					<a href="/" class={anchorSidebar}>
						<HouseIcon class="size-4" />
						<span>Home</span>
					</a>
				</Navigation.Menu>
			</Navigation.Group>
			{#each Object.entries(linksSidebar) as [category, links]}
				<Navigation.Group>
					<Navigation.Label class="capitalize pl-2">{category}</Navigation.Label>
					<Navigation.Menu>
						{#each links as link (link)}
							{@const Icon = link.icon}
							<a href={link.href} class={anchorSidebar} title={link.label} aria-label={link.label}>
								<Icon class="size-4" />
								<span>{link.label}</span>
							</a>
						{/each}
					</Navigation.Menu>
				</Navigation.Group>
			{/each}
		</Navigation.Content>
		<Navigation.Footer>
			<a href="/" class={anchorSidebar} title="Settings" aria-label="Settings">
				<SettingsIcon class="size-4" />
				<span>Settings</span>
			</a>
		</Navigation.Footer>
	</Navigation>
	<!-- --- -->
	<div class="flex justify-center items-center">
		<p class="opacity-50">Contents</p>
	</div>
</div>

```

- Recommended for large sized screens (ex: desktop).
- Ideal for horizontal screen layouts.
- Should be fixed to the left or right of the viewport.
- Supports multiple groups of links for deep navigation.
- Supports a label field per each group.
- Can scroll vertically if contents extend beyond the viewport height.

## Toggle Layout

Using reactive state we can dynamically switch between multiple layouts. Tap the double arrow icon to toggle.

```svelte
<script lang="ts">
	import { ArrowLeftRightIcon, BikeIcon, BookIcon, HouseIcon, TreePalmIcon } from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const links = [
		{ label: 'Home', href: '#', icon: HouseIcon },
		{ label: 'Entertainment', href: '#', icon: BookIcon },
		{ label: 'Recreation', href: '#', icon: BikeIcon },
		{ label: 'Relaxation', href: '#', icon: TreePalmIcon },
	];

	const buttonClasses = 'btn hover:preset-tonal';
	let anchorRail = `${buttonClasses} aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5`;
	let anchorSidebar = `${buttonClasses} justify-start px-2 w-full`;

	let layoutRail = $state(true);

	function toggleLayout() {
		layoutRail = !layoutRail;
	}
</script>

<div class="w-full h-[728px] grid grid-cols-[auto_1fr] items-stretch border border-surface-200-800">
	<!-- --- -->
	<Navigation layout={layoutRail ? 'rail' : 'sidebar'} class={layoutRail ? '' : 'grid grid-rows-[1fr_auto] gap-4'}>
		<Navigation.Content>
			<Navigation.Header>
				<button type="button" class={layoutRail ? anchorRail : anchorSidebar} onclick={toggleLayout}>
					<ArrowLeftRightIcon class={layoutRail ? 'size-5' : 'size-4'} />
					{#if !layoutRail}<span>Resize</span>{/if}
				</button>
			</Navigation.Header>
			<Navigation.Menu>
				{#each links as link (link)}
					{@const Icon = link.icon}
					<a href={link.href} class={layoutRail ? anchorRail : anchorSidebar}>
						<Icon class={layoutRail ? 'size-5' : 'size-4'} />
						<span class={layoutRail ? 'text-[10px]' : ''}>{link.label}</span>
					</a>
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
	</Navigation>
	<!-- --- -->
	<div class="flex justify-center items-center">
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
	</div>
</div>

```

## Anatomy

Here's an overview of how the Navigation component is structured in code:

```svelte
<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
</script>

<Navigation>
	<Navigation.Header />
	<Navigation.Content>
		<Navigation.Group>
			<Navigation.Label />
			<Navigation.Menu />
		</Navigation.Group>
	</Navigation.Content>
	<Navigation.Footer />
</Navigation>
```

## API Reference

### Root

| Prop    | Description                                                                                  | Type                                             | Default |
| ------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| layout  | Sets the data-layout attribute, which modifies the visual presentation of the component set. | "bar" \| "rail" \| "sidebar" \| undefined        | bar     |
| element | Render the element yourself                                                                  | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Header

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"header">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Group

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Label

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Menu

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Footer

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"footer">]> \| undefined | -       |
