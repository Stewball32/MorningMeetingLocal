https://www.skeleton.dev/docs/svelte/tailwind-components/forms.md
last downloaded 2025-11-30

# Forms and Inputs

Various form and input styles.

```astro
<form class="w-full max-w-md space-y-4 p-4">
	<fieldset class="space-y-4">
		<!-- Input -->
		<label class="label">
			<span class="label-text">Input</span>
			<input class="input" type="text" placeholder="Input" />
		</label>
		<!-- Select -->
		<label class="label">
			<span class="label-text">Select</span>
			<select class="select">
				<option value="1">Option 1</option>
				<option value="2">Option 2</option>
				<option value="3">Option 3</option>
				<option value="4">Option 4</option>
				<option value="5">Option 5</option>
			</select>
		</label>
		<!-- Textarea -->
		<label class="label">
			<span class="label-text">Textarea</span>
			<textarea class="textarea rounded-container" rows="4" placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit."
			></textarea>
		</label>
	</fieldset>
	<fieldset class="flex justify-end">
		<!-- Button -->
		<button type="button" class="btn preset-outlined-surface-300-700">Submit</button>
	</fieldset>
</form>

```

## Prerequisites

### Tailwind Forms

Skeleton relies on the official [Tailwind Forms](https://github.com/tailwindlabs/tailwindcss-forms) plugin to normalize form styling. This plugin is <u>required</u> if you wish to use any form utility classes provided on this page.

<figure class="card-filled-enhanced flex justify-center gap-4 p-8">
  <a class="btn preset-filled" href="https://github.com/tailwindlabs/tailwindcss-forms" target="_blank">
    View on Github
  </a>
</figure>

To being, install the `@tailwindcss/forms` package.

```sh
npm install -D @tailwindcss/forms
```

Then implement in your global stylesheet using the the `@plugin` directive.

```css
@import "tailwindcss";
@plugin '@tailwindcss/forms';

/* ...Skeleton config here... */
```

### Windows Bugfix

To avoid a [breaking style issue in Windows-based browsers](https://github.com/skeletonlabs/skeleton/issues/3993), it's recommended you include this temporary fix into your global stylesheet. Please note this change will be automatically and permanently applied for you in Skeleton v5+.

```css
.select,
.input,
.textarea,
.ig-input,
.ig-select {
  background-color: var(--color-surface-50-950);
  color: var(--color-surface-950-50);
}
```

### Browser Support

The quality and appearance of native and semantic HTML form elements can vary between both operating systems and browser vendors. Skeleton does its best to adhere to progressive enhancement best practices. However, we advise you validate support for each element per your target audience.

## Inputs

Supports all [input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#input_types), within reason.

```astro
<form class="mx-auto w-full max-w-md space-y-4">
	<!-- text -->
	<label class="label">
		<span class="label-text">Input</span>
		<input class="input" type="text" placeholder="Input" />
	</label>
	<!-- password -->
	<label class="label">
		<span class="label-text">Input: password</span>
		<input class="input" type="password" placeholder="Input" />
	</label>
	<!-- email -->
	<label class="label">
		<span class="label-text">Input: email</span>
		<input class="input" type="email" placeholder="Input" />
	</label>
	<!-- url -->
	<label class="label">
		<span class="label-text">Input: url</span>
		<input class="input" type="url" placeholder="Input" />
	</label>
	<!-- tel -->
	<label class="label">
		<span class="label-text">Input: tel</span>
		<input class="input" type="tel" placeholder="Input" />
	</label>
	<!-- search -->
	<label class="label">
		<span class="label-text">Input: search</span>
		<input class="input" type="search" placeholder="Input" />
	</label>
	<!-- number -->
	<label class="label">
		<span class="label-text">Input: number</span>
		<input class="input" type="number" placeholder="Input" />
	</label>
</form>

```

## Select

```astro
<form class="mx-auto w-full max-w-md space-y-4">
	<select class="select">
		<option value="1">Option 1</option>
		<option value="2">Option 2</option>
		<option value="3">Option 3</option>
		<option value="4">Option 4</option>
		<option value="5">Option 5</option>
	</select>
</form>

```

## Checkboxes

```astro
<form class="space-y-2">
	<label class="flex items-center space-x-2">
		<input class="checkbox" type="checkbox" checked />
		<p>Option 1</p>
	</label>
	<label class="flex items-center space-x-2">
		<input class="checkbox" type="checkbox" />
		<p>Option 2</p>
	</label>
	<label class="flex items-center space-x-2">
		<input class="checkbox" type="checkbox" />
		<p>Option 3</p>
	</label>
</form>

```

## Radio Groups

```astro
<form class="space-y-2">
	<label class="flex items-center space-x-2">
		<input class="radio" type="radio" checked name="radio-direct" value="1" />
		<p>Option 1</p>
	</label>
	<label class="flex items-center space-x-2">
		<input class="radio" type="radio" name="radio-direct" value="2" />
		<p>Option 2</p>
	</label>
	<label class="flex items-center space-x-2">
		<input class="radio" type="radio" name="radio-direct" value="3" />
		<p>Option 3</p>
	</label>
</form>

```

## Kitchen Sink

Display and functionality of these elements may vary greatly between devices and browsers.

```astro
<form class="mx-auto w-full max-w-md space-y-4">
	<!-- Date Picker -->
	<label class="label">
		<span class="label-text">Date</span>
		<input class="input" type="date" />
	</label>
	<!-- File Input -->
	<label class="label">
		<span class="label-text">File Input</span>
		<input class="input" type="file" />
	</label>
	<!-- Range -->
	<label class="label">
		<span class="label-text">Range</span>
		<input class="input" type="range" value="75" max="100" />
	</label>
	<!-- Progress -->
	<label class="label">
		<span class="label-text">Progress</span>
		<progress class="progress" value="50" max="100"></progress>
	</label>
	<!-- Color -->
	<div class="grid grid-cols-[auto_1fr] gap-2">
		<input class="input" type="color" value="#bada55" />
		<input class="input" type="text" value="#bada55" readonly tabindex="-1" />
	</div>
</form>

```

## Groups

Input groups support a subset of form elements and button styles. These pair well with [Presets](/docs/[framework]/design/presets).

```astro
---
import { CheckIcon, CircleDollarSignIcon, SearchIcon } from 'lucide-react';
---

<form class="w-full space-y-8">
	<!-- Website -->
	<div class="input-group grid-cols-[auto_1fr_auto]">
		<div class="ig-cell preset-tonal">https://</div>
		<input class="ig-input" type="text" placeholder="www.example.com" />
	</div>
	<!-- Amount -->
	<div class="input-group grid-cols-[auto_1fr_auto]">
		<div class="ig-cell preset-tonal">
			<CircleDollarSignIcon size={16} />
		</div>
		<input class="ig-input" type="text" placeholder="Amount" />
		<select class="ig-select">
			<option>USD</option>
			<option>CAD</option>
			<option>EUR</option>
		</select>
	</div>
	<!-- Username -->
	<div class="input-group grid-cols-[1fr_auto]">
		<input class="ig-input" type="text" placeholder="Enter Username..." />
		<button class="ig-btn preset-filled" title="Username already in use.">
			<CheckIcon size={16} />
		</button>
	</div>
	<!-- Search -->
	<div class="input-group grid-cols-[auto_1fr_auto]">
		<div class="ig-cell preset-tonal">
			<SearchIcon size={16} />
		</div>
		<input class="ig-input" type="search" placeholder="Search..." />
		<button class="ig-btn preset-filled">Submit</button>
	</div>
</form>

```

\| Class | Usage |
\| ------------- | --------------------------------------- |
\| `input-group` | Defines the parent input group set. |
\| `ig-cell` | Defines a child cell for text or icons. |
\| `ig-input` | Defines a child input of `type="text"`. |
\| `ig-select` | Defines a child select element. |
\| `ig-btn` | Defines a child button. |
