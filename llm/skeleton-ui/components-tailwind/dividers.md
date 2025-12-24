https://www.skeleton.dev/docs/svelte/tailwind-components/dividers.md
last downloaded 2025-11-30

# Dividers

Horizontal and vertical rule styling.

```astro
<div class="w-full space-y-4 text-center">
	<p>Above the divider.</p>

	<hr class="hr" />

	<p>Below the divider.</p>
</div>

```

## Size

Use Tailwind's [border width](https://tailwindcss.com/docs/border-width) utilities to adjust thickness.

```astro
<div class="w-full space-y-4">
	<code class="inline-block code">Default</code>
	<hr class="hr" />

	<code class="inline-block code">border-t-2</code>
	<hr class="hr border-t-2" />

	<code class="inline-block code">border-t-4</code>
	<hr class="hr border-t-4" />

	<code class="inline-block code">border-t-8</code>
	<hr class="hr border-t-8" />
</div>

```

## Style

Use Tailwind's [border style](https://tailwindcss.com/docs/border-style) utilities to adjust visual style.

```astro
<div class="w-full space-y-4">
	<code class="inline-block code">border-solid</code>
	<hr class="hr border-solid" />

	<code class="inline-block code">border-dashed</code>
	<hr class="hr border-dashed" />

	<code class="inline-block code">border-dotted</code>
	<hr class="hr border-dotted" />

	<code class="inline-block code">border-double</code>
	<hr class="hr border-4 border-double" />
</div>

```

## Colors

Use any Tailwind or Skeleton [colors or pairing](/docs/[framework]/design/colors).

```astro
<div class="w-full space-y-4">
	<code class="inline-block code">border-primary-500</code>
	<hr class="hr border-primary-500" />

	<code class="inline-block code">border-secondary-500</code>
	<hr class="hr border-secondary-500" />

	<code class="inline-block code">border-tertiary-500</code>
	<hr class="hr border-tertiary-500" />

	<code class="inline-block code">border-success-500</code>
	<hr class="hr border-success-500" />

	<code class="inline-block code">border-warning-500</code>
	<hr class="hr border-warning-500" />

	<code class="inline-block code">border-error-500</code>
	<hr class="hr border-error-500" />

	<code class="inline-block code">border-surface-950-50</code>
	<hr class="hr border-surface-950-50" />
</div>

```

## Vertical

Use `vr` for a vertical rule, which supports all above styles. Make sure to set the height.

```astro
<div class="grid h-20 grid-cols-[auto_auto_auto_auto_auto_auto] items-center gap-4">
	<span><code class="code">Default</code> &rarr;</span>

	<span class="vr"></span>
	<span class="vr border-l-2"></span>
	<span class="vr border-l-4"></span>
	<span class="vr border-l-8"></span>

	<span>&larr; <code class="code">border-l-8</code></span>
</div>

```
