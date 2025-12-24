<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const actions = data.actions ?? [];
	const highlights = data.highlights ?? [];
	const stats = data.stats ?? [];
</script>

<main class="mx-auto flex max-w-6xl flex-col gap-6 px-3 py-6 md:px-6">
	<section class="rounded-3xl border border-surface-200-800 bg-surface-50-950/80 p-6 shadow-lg backdrop-blur md:p-8">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div class="space-y-2">
				<p class="text-sm uppercase tracking-wide text-surface-700-300">Overview</p>
				<h2 class="text-3xl font-bold md:text-4xl">{data.layout.title}</h2>
				<p class="text-surface-700-300">{data.layout.subtitle}</p>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each actions as action}
					<a href={action.href} class={`btn ${action.tone} px-4 py-3 text-sm font-semibold`}>
						{action.label}
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="grid gap-4 md:grid-cols-3">
		{#each stats as stat}
			<article class="rounded-2xl border border-surface-200-800 bg-surface-50-950/80 p-4 shadow-sm backdrop-blur">
				<p class="text-xs uppercase tracking-wide text-surface-700-300">{stat.label}</p>
				<p class="mt-1 text-xl font-semibold">{stat.value}</p>
				<p class="text-sm text-surface-700-300">{stat.detail}</p>
			</article>
		{/each}
	</section>

	<section class="grid gap-4 lg:grid-cols-[2fr_1fr]">
		<article class="rounded-2xl border border-surface-200-800 bg-surface-50-950/80 p-5 shadow-sm backdrop-blur">
			<div class="flex items-center justify-between gap-3">
				<div>
					<p class="text-xs uppercase tracking-wide text-surface-700-300">Today</p>
					<h3 class="text-lg font-semibold">Session flow</h3>
				</div>
				<span class="badge preset-tonal px-3 py-1 text-xs">Draft</span>
			</div>
			<ol class="mt-4 space-y-3">
				<li class="rounded-xl border border-surface-200-800 bg-surface-50-950/70 p-3">
					<p class="text-sm font-semibold">Welcome</p>
					<p class="text-xs text-surface-700-300">Greeting, attendance, and energy check.</p>
				</li>
				<li class="rounded-xl border border-surface-200-800 bg-surface-50-950/70 p-3">
					<p class="text-sm font-semibold">Presentation</p>
					<p class="text-xs text-surface-700-300">Use the deck queued for today; send the poll midway.</p>
				</li>
				<li class="rounded-xl border border-surface-200-800 bg-surface-50-950/70 p-3">
					<p class="text-sm font-semibold">Wrap up</p>
					<p class="text-xs text-surface-700-300">Share wins, set a reminder, and release students.</p>
				</li>
			</ol>
		</article>

		<article class="rounded-2xl border border-surface-200-800 bg-surface-50-950/80 p-5 shadow-sm backdrop-blur">
			<p class="text-xs uppercase tracking-wide text-surface-700-300">Notes</p>
			<h3 class="text-lg font-semibold">Reminders</h3>
			<ul class="mt-4 space-y-3">
				{#each highlights as item}
					<li class="rounded-xl border border-surface-200-800 bg-surface-50-950/70 p-3">
						<p class="text-sm font-semibold">{item.title}</p>
						<p class="text-xs text-surface-700-300">{item.body}</p>
					</li>
				{/each}
			</ul>
		</article>
	</section>

	<section class="rounded-2xl border border-surface-200-800 bg-surface-50-950/80 p-5 shadow-sm backdrop-blur">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<p class="text-xs uppercase tracking-wide text-surface-700-300">Log</p>
				<h3 class="text-lg font-semibold">Recent updates</h3>
			</div>
			<a class="text-sm text-primary-500 hover:underline" href="/presentations">View all</a>
		</div>
		<div class="mt-4 grid gap-3 md:grid-cols-2">
			<div class="rounded-xl border border-surface-200-800 bg-surface-50-950/70 p-3">
				<p class="text-sm font-semibold">Slides synced</p>
				<p class="text-xs text-surface-700-300">Added 3 slides to “Habit Building”.</p>
			</div>
			<div class="rounded-xl border border-surface-200-800 bg-surface-50-950/70 p-3">
				<p class="text-sm font-semibold">People</p>
				<p class="text-xs text-surface-700-300">Updated roster for Classroom A.</p>
			</div>
			<div class="rounded-xl border border-surface-200-800 bg-surface-50-950/70 p-3">
				<p class="text-sm font-semibold">Schedule</p>
				<p class="text-xs text-surface-700-300">Tomorrow’s session marked as “Prep”.</p>
			</div>
			<div class="rounded-xl border border-surface-200-800 bg-surface-50-950/70 p-3">
				<p class="text-sm font-semibold">Guests</p>
				<p class="text-xs text-surface-700-300">Guest room opened for parents.</p>
			</div>
		</div>
	</section>
</main>
