https://www.skeleton.dev/docs/svelte/get-started/fundamentals.md
last downloaded 2025-11-30

# Fundamentals

An introduction to the core concepts of Skeleton.

Skeleton is comprised of three pillars - the design system, our extensions to Tailwind, and an optional suite of framework-specific components. Together these form a comprehensive solution for designing and implementing complex web interfaces at scale.

---

## Design System

Explore each pillar of the Skeleton design system. Provided via the Skeleton core.

<NavigationGrid filter={(doc) => doc.id.includes('design/')} class="md:grid-cols-2" />

---

## Tailwind Components

Tailwind components that act as primitives for creating complex interfaces. Provided via the Skeleton core.

<NavigationGrid filter={(doc) => doc.id.includes('tailwind-components/')} class="md:grid-cols-2" />

---

## Framework Components

Skeleton also offers optional component packages for select component frameworks. Each component automatically adapts to Skeleton's design system. While still allowing a high level of customization.

### Supported Frameworks

\| Framework | NPM Package | Description |
\| --------- | ------------------------------- | ------------------------------- |
\| React | `@skeletonlabs/skeleton-react` | Contains all React components. |
\| Svelte | `@skeletonlabs/skeleton-svelte` | Contains all Svelte components. |

### Powered by Zag.js

Skeleton's components are built on **Zag.js**, which provides a collection of framework-agnostic UI component patterns to manage logic and state. Zag is actively maintained by industry veterans, such as [Segun Adebayo](https://github.com/segunadebayo) - the creator and core maintainer for [Chakra UI](https://www.chakra-ui.com/), [Ark UI](https://ark-ui.com/), and [PandaCSS](https://panda-css.com/).

<figure class="linker bg-noise">
  <a class="btn preset-filled" href="https://zagjs.com/" target="_blank">
    View Zag.js
  </a>
</figure>

### Importing Components

You may import components per each Skeleton framework as follows.

```ts
import { Avatar } from "@skeletonlabs/skeleton-svelte";
```

This also includes access to the component prop types.

```ts
import type { AvatarRootProps, ... } from '@skeletonlabs/skeleton-svelte';
```

### Composed Pattern

Skeleton components are granular. This offers direct access to all children within the tree, similar to working with raw HTML. This allows passing in arbitrary props and attributes directly to the the template within. Including: `required`, `data-*`, `style`, `class`, and more.

```svelte
<Avatar>
	<Avatar.Image src="https://i.pravatar.cc/150?img=48" />
	<Avatar.Fallback>SK</Avatar.Fallback>
</Avatar>
```

### Styling Components

Skeleton components implement a universal convention for accepting CSS utility classes via the `class` attribute. Use this to pass any CSS utility class.

```svelte
<Avatar class="rounded-2xl">
	<Avatar.Image src="https://i.pravatar.cc/150?img=48" class="greyscale" />
	<Avatar.Fallback>SK</Avatar.Fallback>
</Avatar>
```

By default, all internal styles are auto-prefixed to ensure they are assigned to the `@base` layer. This ensures any classes you pass through the `class` attribute are automatically given precedence. No mental overhead, it just works.

```css
@custom-variant skb {
  @layer base {
    @slot;
  }
}
```

### Extensible Markup

Skeleton components provide a mechanism for overwriting the internal HTML with custom markup. Use the `element` prop to provide a custom element, this prop accepts a function which the `attributes` are passed into. Then spread the `attributes` to your custom elements. Note that this is an optional and advanced feature aimed at power users, and should not be needed for normal usage.

```svelte
<Accordion>
	<Accordion.Item value="item-1">
		<h3>
			<Accordion.ItemTrigger>
				{#snippet element(attributes)}
					<button {...attributes}>My Own Button</button>
				{/snippet}
			</Accordion.ItemTrigger>
		</h3>
		<Accordion.ItemContent>Content for Item 1</Accordion.ItemContent>
	</Accordion.Item>
</Accordion>
```

### Custom Animations

Using the extensible markup pattern, you may implement custom animations. We showcase this below with [Svelte Transitions](https://svelte.dev/docs/svelte/transition), but you could also use framework agnostic solutions such as [Motion](https://motion.dev/), [Anime.js](https://animejs.com/), or [Animate.css](https://animate.style/).

```svelte
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { slide } from 'svelte/transition';
</script>

<Accordion>
	{#each ['1', '2', '3'] as item (item)}
		<Accordion.Item value="item-{item}">
			<h3>
				<Accordion.ItemTrigger>Item {item}</Accordion.ItemTrigger>
			</h3>
			<Accordion.ItemContent>
				{#snippet element(attributes)}
					{#if !attributes.hidden}
						<div {...attributes} transition:slide>Content for item {item}</div>
					{/if}
				{/snippet}
			</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>
```

1. Implement the `element` snippet to gain access to the `attributes`.
2. Spread the `attributes` to the custom element, a `<div>` in this example.
3. Add the `transition:slide` and configure your preferred options.
4. Then implement the wrapping `#if` block that triggers transitions when `attribute.hidden` is toggled.

### Provider Pattern

Most Skeleton components also support the Provider Pattern. This utilizes a provider component that replaces the root and provides access to the underlying component APIs. In practice, this allows direct access to Zag.js API features, such as programmatic control for overlay components, the ability to clear input components, and more.

```svelte
<script lang="ts">
	import { Portal, Tooltip, useTooltip } from '@skeletonlabs/skeleton-svelte';

	const id = $props.id();
	const tooltip = useTooltip({ id });
</script>

<button type="button" onclick={() => tooltip().setOpen(!tooltip().open)}>Trigger</button>

<Tooltip.Provider value={tooltip}>
	<Tooltip.Trigger>Anchor</Tooltip.Trigger>
	<Portal>
		<Tooltip.Positioner>
			<Tooltip.Content>Content</Tooltip.Content>
		</Tooltip.Positioner>
	</Portal>
</Tooltip.Provider>
```

> Note: Svelte requires passing `id` because `$props.id` is not available outside the component's `<script>` block.

### Learn More

For a comprehensive guide to how Skeleton implements components, refer to our [contribution guidelines](/docs/[framework]/resources/contribute/components).
