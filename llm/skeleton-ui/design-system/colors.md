https://www.skeleton.dev/docs/svelte/design/colors.md
last downloaded 2025-11-30

# Colors

The Skeleton color system.

Skeleton provides guardrails and utilities to help you craft your custom color system. This includes a number of colors, shades, and contrast values that work together seamlessly. Providing a visually appealing and accessible palette for each theme.

## Color Palette

<Default />

Supports <u>all</u> Tailwind color utility classes using the following pattern.

```txt
{property}-{color}-{shade}
```

\| Key | Accepted Values |
\| -------- | ---------------------------------------------------------------------------------------------------------------- |
\| Property | `accent`, `bg`, `border`, `caret`, `decoration`, `divide`, `fill`, `outline`, `ring`, `shadow`, `stroke`, `text` |
\| Color | `primary`, `secondary`, `tertiary`, `success`, `warning`, `error`, `surface` |
\| Shade | `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950` |

```html
<div class="bg-primary-500">...</div>
<div class="border border-secondary-600">...</div>
<svg class="fill-surface-950">...</svg>
```

---

## Contrast Colors

Test the following with different themes and dark mode combinations.

```astro
---
import { SwatchBookIcon } from 'lucide-react';
---

<section class="space-y-8">
	<div class="grid grid-cols-3 gap-6">
		<!-- Standard Colors -->
		<div class="flex flex-col space-y-2">
			<p class="text-xs">Direct Use</p>
			<div class="badge justify-start bg-primary-500 text-primary-contrast-500">
				<SwatchBookIcon className="size-4" />
				<span>Primary</span>
			</div>
			<div class="badge justify-start bg-secondary-500 text-secondary-contrast-500">
				<SwatchBookIcon className="size-4" />
				<span>Secondary</span>
			</div>
			<div class="badge justify-start bg-tertiary-500 text-tertiary-contrast-500">
				<SwatchBookIcon className="size-4" />
				<span>Tertiary</span>
			</div>
		</div>
		<!-- Presets -->
		<div class="flex flex-col space-y-2">
			<p class="text-xs">Presets</p>
			<div class="badge justify-start preset-filled-primary-950-50">
				<SwatchBookIcon className="size-4" />
				<span>Primary</span>
			</div>
			<div class="badge justify-start preset-filled-secondary-950-50">
				<SwatchBookIcon className="size-4" />
				<span>Secondary</span>
			</div>
			<div class="badge justify-start preset-filled-tertiary-950-50">
				<SwatchBookIcon className="size-4" />
				<span>Tertiary</span>
			</div>
		</div>
		<!-- Preset + Pairings -->
		<div class="flex flex-col space-y-2">
			<p class="text-xs">Preset + Pairings</p>
			<div class="badge justify-start preset-filled-primary-50-950">
				<SwatchBookIcon className="size-4" />
				<span>Primary</span>
			</div>
			<div class="badge justify-start preset-filled-secondary-50-950">
				<SwatchBookIcon className="size-4" />
				<span>Secondary</span>
			</div>
			<div class="badge justify-start preset-filled-tertiary-50-950">
				<SwatchBookIcon className="size-4" />
				<span>Tertiary</span>
			</div>
		</div>
	</div>
</section>

```

Contrast color values are available for every shade in the color ramp. Use these to set accessible text color and icon fill values. You may also refer to the [Preset system](/docs/[framework]/design/presets) for utility classes that automatically mix each color and contrast tone.

```txt
{property}-{color}-contrast-{shade}
```

---

## Color Pairings

<Pairings />

Provides a condensed syntax for dual-tone color values, evenly balanced to swap between light and dark mode. Pairings are supported for all Tailwind utility color classes (`bg`, `border`, `fill`, etc).

```txt
{property}-{color}-{lightModeShade}-{darkModeShade}
```

```html
<div class="bg-surface-200-800">...</div>
<div class="border border-secondary-400-600">...</div>
<svg class="fill-secondary-50-950">...</svg>
```

### How Pairings Work

Color Pairing are enabled through the use of the CSS [light-dark](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) function. This means instead of writing the standard light/dark syntax with Tailwind utilities:

```html
<div class="text-primary-300 dark:text-primary-700">...</div>
```

You can instead use a much more condensed syntax:

```html
<div class="text-primary-300-700">...</div>
```

This will then be implemented into your CSS bundle as follows:

```css
.text-primary-300-700 {
  color: light-dark(var(--color-primary-300), var(--color-primary-700));
}
```

Plus, as a benefit to using the CSS `light-dark()` function, this also enables use of Tailwind's [Color Scheme](https://tailwindcss.com/docs/color-scheme) utilities. Learn more about [using Color Scheme](/docs/guides/mode#color-scheme).

### When to Use Pairings

Color Parings are useful for generating a hierarchy of visual layers, ranging from foreground to background elements. Each reuse the same color ramp, but invert the order when switching from light to dark mode.

<PairingsStack />

- We can use shade `950` for light mode and `50` from dark mode to represent our body text color.
- Then use shade `50` from light mode and `950` from dark mode to represent our app background.
- Use the static `500` shade for key branding elements, such as buttons or banners.
- Then reserve multiple layers between for elements such as cards, inputs, and more.

---

## Transparency

All available Skeleton Colors and Color Pairings support Tailwind's color transparency syntax.

```html
<div class="bg-primary-500/25">Primary Color @ 25% transparency</div>
<div class="bg-surface-50-950/60">
  Surface Pairing 50/950 @ 60% transparency
</div>
```
