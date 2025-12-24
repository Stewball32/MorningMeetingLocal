https://www.skeleton.dev/docs/svelte/design/iconography.md
last downloaded 2025-11-30

# Iconography

Learn how to integrate Lucide for iconography in Skeleton.

Skeleton takes an agnostic approach to icons, allowing you to use any combination of SVGs, emoji, unicode, or dedicated icon libraries. Mix and match to fulfill your project's unique requirements.

## Lucide

<figure class="linker bg-noise">
  <div class="flex gap-4">
    <HeartIcon class="size-12" />

    <UserRoundIcon class="size-12" />

    <TriangleIcon class="size-12" />

  </div>
</figure>

While Skeleton does not bundle an official icon library, we highly recommend the use of [Lucide](https://lucide.dev/). This provides a huge selection of icons that are available to all popular frameworks, while featuring a clean and modern aesthetic. All code examples within this Skeleton documentation site have been implement using **Lucide**, but feel free to replace with any alternative of your choice.

## Installation

Follow the official instructions to install [Lucide for Svelte](https://lucide.dev/guide/packages/lucide-svelte).

## Usage

```svelte
<script>
	import { SkullIcon } from '@lucide/svelte';
</script>

<SkullIcon stroke="pink" class="size-8" />
```

## Alternatives

Looking for something a bit different? Check out these other popular alternatives.

{/_ prettier-ignore _/}

- [Iconify](https://iconify.design/): provides a vast array of icon sets supported by popular icon libraries.
- [Font Awesome](https://fontawesome.com/): provides a huge variety of icons in their free tier.
- [SimpleIcons](https://simpleicons.org/): provides an excellent selection of brand icons.

{/_ prettier-ignore _/}
