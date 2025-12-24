https://www.skeleton.dev/docs/svelte/design/typography.md
last downloaded 2025-11-30

# Typography

The Skeleton typography system.

Skeleton provides an array of opt-in utility classes for common typographic elements. As well as providing a fully functional typography scale base on theme settings. With guidance on crafting a custom semantic typography set tailored for your project's individual needs.

## Native Element Styles

Skeleton provides the following utlity classes for styling semantic native HTML elements. All styles are opt-in by default, providing an escape hatch when you need to break from convention.

### Headings

```astro
<div class="space-y-4">
	<h1 class="h1">Heading 1</h1>
	<h2 class="h2">Heading 2</h2>
	<h3 class="h3">Heading 3</h3>
	<h4 class="h4">Heading 4</h4>
	<h5 class="h5">Heading 5</h5>
	<h6 class="h6">Heading 6</h6>
</div>

```

### Paragraphs

```astro
<p>The quick brown fox jumps over the lazy dog</p>

```

### Blockquotes

```astro
<blockquote class="blockquote">
	"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, aliquid. Molestias, odio illum voluptatibus natus dignissimos, quidem
	est unde aspernatur veniam pariatur fuga distinctio esse in quas, repellendus neque reiciendis!"
</blockquote>

```

### Anchor

```astro
<a href="/" class="anchor">Anchor</a>

```

### Pre-Formatted

```astro
<pre class="pre">The quick brown fox jumps over the lazy dog.</pre>

```

### Code

```astro
<div>Insert the <code class="code">.example</code> class here.</div>

```

### Keyboard

```astro
<div>Press <kbd class="kbd">⌘</kbd> + <kbd class="kbd">C</kbd> to copy.</div>

```

### Insert & Delete

```astro
<div class="w-full">
	<del class="del"><s>Always</s> Gonna Give You Up</del>
	<ins class="ins" cite="https://youtu.be/dQw4w9WgXcQ" datetime="10-31-2022"> Never Gonna Give You Up </ins>
</div>

```

### Mark

```astro
<p>
	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, <mark class="mark">aliquid</mark>. Molestias, odio illum voluptatibus
	<mark class="mark">natus dignissimos</mark>, quidem est unde aspernatur veniam pariatur fuga.
</p>

```

### Lists

Skeleton defers to Tailwind's built-in utility classes for common list styles.

```astro
<div class="w-full space-y-4">
	<!-- Basic List -->
	<section class="space-y-4">
		<p class="text-lg font-bold">Basic List</p>
		<ul class="list-inside list-none space-y-2">
			<li>Id maxime optio soluta placeat ea eaque similique consectetur dicta tempore.</li>
			<li>Repellat veritatis et harum ad sint reprehenderit tenetur, possimus tempora.</li>
			<li>Lorem ipsum dolor sit amet consectetur adipisicing elit harum ad sint.</li>
		</ul>
	</section>

	<hr class="hr" />

	<!-- Unordered List -->
	<section class="space-y-4">
		<p class="text-lg font-bold">Unordered List</p>
		<ul class="list-inside list-disc space-y-2">
			<li>Id maxime optio soluta placeat ea eaque similique consectetur dicta tempore.</li>
			<li>Repellat veritatis et harum ad sint reprehenderit tenetur, possimus tempora.</li>
			<li>Lorem ipsum dolor sit amet consectetur adipisicing elit harum ad sint.</li>
		</ul>
	</section>

	<hr class="hr" />

	<!-- Ordered List -->
	<section class="space-y-4">
		<p class="text-lg font-bold">Ordered List</p>
		<ul class="list-inside list-decimal space-y-2">
			<li>Id maxime optio soluta placeat ea eaque similique consectetur dicta tempore.</li>
			<li>Repellat veritatis et harum ad sint reprehenderit tenetur, possimus tempora.</li>
			<li>Lorem ipsum dolor sit amet consectetur adipisicing elit harum ad sint.</li>
		</ul>
	</section>

	<hr class="hr" />

	<!-- Description List -->
	<section class="space-y-4">
		<p class="text-lg font-bold">Description List</p>
		<dl class="space-y-2">
			<div>
				<dt class="font-bold">Item A</dt>
				<dd class="opacity-60">Id maxime optio soluta placeat ea eaque similique consectetur dicta tempore.</dd>
			</div>
			<div>
				<dt class="font-bold">Item B</dt>
				<dd class="opacity-60">Repellat veritatis et harum ad sint reprehenderit tenetur, possimus tempora.</dd>
			</div>
			<div>
				<dt class="font-bold">Item C</dt>
				<dd class="opacity-60">Lorem ipsum dolor sit amet consectetur adipisicing elit harum ad sint.</dd>
			</div>
		</dl>
	</section>

	<hr class="hr" />

	<!-- Navigation List -->
	<nav class="space-y-2">
		<!-- Optional Heading -->
		<p class="text-lg font-bold">Navigation List</p>
		<!-- / -->
		<ul class="space-y-2">
			<li>
				<a class="anchor" href="#">Home</a>
			</li>
			<li>
				<a class="anchor" href="#">About</a>
			</li>
			<li>
				<a class="anchor" href="#">Blog</a>
			</li>
		</ul>
	</nav>
</div>

```

## Advanced Features

The following features are optional and intended for professionals with moderate understanding of web-based typography. If you're unfamiliar with these concepts, feel free skip them and use the friendly defaults Skeleton provides out of the box.

### Typographic Scale

Skeleton augments [Tailwind's font-size](https://tailwindcss.com/docs/font-size) utilities to support a customizable [Typographic Scale](https://designcode.io/typographic-scales). Put simply, by modifying your theme's `--text-scaling` property, you can control the overall scale of text sizing globally throughout your application. See the [Core API](/docs/get-started/core-api#typography) to review the scaling forumula.

<Preview client:visible>
  <Typescale client:visible />
</Preview>

> TIP: the base scale size is `1.0` for `100%`

### Semantic Typography

When working with a designer, they may craft a semantic set of typography for your project. These might include semantic names, canned sizes, and pre-configured styling. To handle this in Skeleton, we recommend following best practices for [User Generated Presets](/docs/[framework]/design/presets#user-generated), while mixing CSS primitives with semantic HTML elements to replicate all required styles.

We've provided a boilerplate below to help you get started. Implement in your global stylesheet, and customize as needed.

```svelte
<div class="table-wrap">
	<table class="table">
		<thead>
			<tr>
				<th>Class</th>
				<th>Preview</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code class="code">preset-typo-display-4</code></td>
				<td><h1 class="preset-typo-display-4">Aa</h1></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-display-3</code></td>
				<td><h2 class="preset-typo-display-3">Aa</h2></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-display-2</code></td>
				<td><h3 class="preset-typo-display-2">Aa</h3></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-display-1</code></td>
				<td><h4 class="preset-typo-display-1">Aa</h4></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-headline</code></td>
				<td><p class="preset-typo-headline">Headline</p></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-title</code></td>
				<td><p class="preset-typo-title">Title</p></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-subtitle</code></td>
				<td><p class="preset-typo-subtitle">Subtitle</p></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-body-1</code></td>
				<td>
					<p class="preset-typo-body-1">Body 1</p>
				</td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-body-2</code></td>
				<td>
					<p class="preset-typo-body-2">Body 2</p>
				</td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-caption</code></td>
				<td><span class="preset-typo-caption">Caption</span></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-menu</code></td>
				<td><span class="preset-typo-menu">Menu</span></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-button</code></td>
				<td><span class="preset-typo-button">Button</span></td>
			</tr>
		</tbody>
	</table>
</div>

<style lang="postcss">
	/* IGNORE THIS: this is only required for our example <style> block. */
	/* https://tailwindcss.com/docs/functions-and-directives#reference-directive */
	@reference "@/app.css";

	/*
		In a real world project, copy the following into your global stylesheet.
		Then rename, adjust the styles, and otherwise modify as desired.

		For a quick reference for these theme variables, see the Core API:
		http://skeleton.dev/docs/get-started/core-api#typography
	*/

	/* Headings */
	.preset-typo-display-4,
	.preset-typo-display-3,
	.preset-typo-display-2,
	.preset-typo-display-1,
	.preset-typo-headline,
	.preset-typo-title,
	.preset-typo-subtitle,
	.preset-typo-caption,
	.preset-typo-menu,
	.preset-typo-button {
		color: var(--heading-font-color);
		font-family: var(--heading-font-family);
		font-weight: var(--heading-font-weight);
		@variant dark {
			color: var(--heading-font-color-dark);
		}
	}

	/* Body */
	.preset-typo-body-1,
	.preset-typo-body-2,
	.preset-typo-caption,
	.preset-typo-menu,
	.preset-typo-button {
		color: var(--heading-font-color);
		@variant dark {
			color: var(--heading-font-color-dark);
		}
	}

	/* Unique Properties */
	.preset-typo-display-4 {
		font-size: var(--text-7xl);
		@variant lg {
			font-size: var(--text-9xl);
		}
	}
	.preset-typo-display-3 {
		font-size: var(--text-6xl);
		@variant lg {
			font-size: var(--text-8xl);
		}
	}
	.preset-typo-display-2 {
		font-size: var(--text-5xl);
		@variant lg {
			font-size: var(--text-7xl);
		}
	}
	.preset-typo-display-1 {
		font-size: var(--text-4xl);
		@variant lg {
			font-size: var(--text-6xl);
		}
	}
	.preset-typo-headline {
		font-size: var(--text-2xl);
		@variant lg {
			font-size: var(--text-4xl);
		}
	}
	.preset-typo-title {
		font-size: var(--text-xl);
		@variant lg {
			font-size: var(--text-3xl);
		}
	}
	.preset-typo-subtitle {
		font-size: var(--text-base);
		font-family: var(--heading-font-family);
		color: var(--color-surface-700-300);
		@variant lg {
			font-size: var(--text-xl);
		}
	}
	.preset-typo-body-1 {
		font-size: var(--text-xl);
		@variant lg {
			font-size: var(--text-3xl);
		}
	}
	.preset-typo-body-2 {
		font-size: var(--text-lg);
		@variant lg {
			font-size: var(--text-xl);
		}
	}
	.preset-typo-caption {
		font-size: var(--text-sm);
		color: var(--color-surface-700-300);
	}
	.preset-typo-menu {
		font-weight: bold;
	}
	.preset-typo-button {
		font-weight: bold;
	}
</style>

```
