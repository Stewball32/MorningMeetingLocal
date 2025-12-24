<script lang="ts">
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	import { AppBar, Navigation, Toast } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import '../app.css';
	import { navTiles, navFooter } from './nav';
	import { onMount } from 'svelte';
	import { AlertTriangleIcon, CheckCircle2Icon, HomeIcon, InfoIcon, MenuIcon, XCircleIcon } from '@lucide/svelte';
	import { toaster } from '$lib/toaster';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const anchorBar = 'btn hover:preset-tonal aspect-square h-24 flex-col items-center gap-1 text-[10px]';
	const anchorRail =
		'btn hover:preset-tonal aspect-square w-20 flex flex-col items-center gap-0.5 text-[10px]';

	const showMenu = $derived(data.showMenu ?? true);
	const pageData = $derived(page.data ?? {});
	const layoutInfo = $derived((pageData as { layout?: unknown }).layout ?? pageData);
	const toStringOrUndefined = (value: unknown) =>
		typeof value === 'string' && value.trim().length ? value : undefined;

	// Pages can set `pageTitle` or `layout: { title, subtitle }` in their +page load to populate this header.
	const headerTitle = $derived(
		toStringOrUndefined((layoutInfo as { title?: unknown })?.title) ??
			toStringOrUndefined((pageData as { pageTitle?: unknown })?.pageTitle) ??
			'Morning Meeting'
	);
	const headerSubtitle = $derived(
		toStringOrUndefined((layoutInfo as { subtitle?: unknown })?.subtitle) ??
			toStringOrUndefined((pageData as { pageSubtitle?: unknown })?.pageSubtitle) ??
			''
	);

	let scrolled = $state(false);
	let scrollRegion: HTMLElement | null = null;
	let headerEl: HTMLElement | null = null;
	let headerHeight = $state(0);
	const handleScroll = () => {
		scrolled = (scrollRegion?.scrollTop ?? 0) > 12;
	};

	const updateHeaderHeight = () => {
		headerHeight = headerEl?.offsetHeight ?? 0;
	};

	const toastIcon = (type?: string) => {
		switch (type) {
			case 'success':
				return CheckCircle2Icon;
			case 'warning':
				return AlertTriangleIcon;
			case 'error':
				return XCircleIcon;
			default:
				return InfoIcon;
		}
	};

	onMount(() => {
		updateHeaderHeight();
		const ro = new ResizeObserver(updateHeaderHeight);
		if (headerEl) ro.observe(headerEl);
		return () => ro.disconnect();
	});
</script>

<div class="h-screen overflow-hidden bg-linear-to-br from-blue-300 to-red-300 text-surface-900-100 flex flex-col">
	<div
		class={`sticky top-0 z-30  transition-all duration-200  ${
			!scrolled || ''
		}`}
		bind:this={headerEl}
	>
		<AppBar class="p-0">
			<!-- <AppBar.Toolbar class="grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-center gap-3 px-4 md:px-6 py-3"> -->

        <!-- <AppBar.Lead class="flex items-center gap-2">
					<a href="/" class="btn-icon btn-icon-lg hover:preset-tonal" aria-label="Home">
						<span class="font-bold">MM</span>
					</a>
					<p class="text-xs uppercase tracking-wide text-surface-700-300">
						{data.pathname === '/' ? 'Home' : data.pathname}
					</p>
				</AppBar.Lead> -->


	<AppBar.Toolbar class="grid-cols-[1fr_5fr_1fr]">
		<AppBar.Lead class=" w-16 md:w-24 flex justify-center items-center">

      <a href="/" class={anchorRail} aria-label="home">
        <HomeIcon />
        <!-- <span>Home</span> -->
      </a>

			<!-- <button type="button" class="btn-icon  btn-icon-lg hover:preset-tonal"></button> -->
		</AppBar.Lead>
		<AppBar.Headline class="flex flex-col justify-center items-center">
      <h2>{headerTitle}</h2>
      {#if headerSubtitle}
      <p class=" font-thin italic text-sm p-0 ">{headerSubtitle}</p>
      {/if}
		</AppBar.Headline>
		<AppBar.Trail class="justify-end">
		</AppBar.Trail>

				<!-- <AppBar.Headline class="min-w-0">
					<div class="space-y-1">
						<h1 class="truncate text-xl font-semibold md:text-2xl">{headerTitle}</h1>
						{#if headerSubtitle}
							<p class="truncate text-sm text-surface-700-300">{headerSubtitle}</p>
						{/if}
					</div>
				</AppBar.Headline> -->

				<!-- <AppBar.Trail class="hidden items-center gap-2 md:flex">
				</AppBar.Trail> -->
			</AppBar.Toolbar>
		</AppBar>
	</div>

	<div
		class="flex flex-1 min-h-0 gap-3 overflow-hidden px-0 pb-0 pr-3 md:px-0 "
		style={`--header-height:${headerHeight}px; height: calc(100vh - ${headerHeight}px);`}
	>
		{#if showMenu}
			<!-- Desktop: Rail -->
			<Navigation
				layout="rail"
				class="hidden min-h-0 w-24 grid-rows-[auto_1fr_auto] border-r border-surface-200-800 bg-surface-100-900 backdrop-blur md:grid"
				style={`height: calc(100vh - ${headerHeight}px); position: sticky; top: var(--header-height);`}
			>
				<Navigation.Header>
					<!-- <a href="/" class={anchorRail} aria-label="Home">
						<span class="text-base font-bold">MM</span>
					</a> -->
				</Navigation.Header>
				<Navigation.Content>
					<Navigation.Menu>
						{#each navTiles as link (link.href)}
							{@const Icon = link.icon}
							<a href={link.href} class={anchorRail} aria-label={link.labelExpanded ?? link.label}>
								<Icon class="size-5" />
								<span>{link.label}</span>
							</a>
						{/each}
					</Navigation.Menu>
				</Navigation.Content>
				{#if navFooter.length}
					<Navigation.Footer>
						{#each navFooter as link (link.href)}
							{@const Icon = link.icon}
							<a href={link.href} class={anchorRail} aria-label={link.labelExpanded ?? link.label}>
								<Icon class="size-5" />
								<span>{link.label}</span>
							</a>
						{/each}
					</Navigation.Footer>
				{/if}
			</Navigation>
		{/if}

		<div
			class="flex-1 overflow-hidden "
			style={`height: calc(100vh - ${headerHeight}px);`}
		>
			<main
				class="h-full overflow-auto px-3 pb-24 pt-4 md:px-6 md:pb-10"
				bind:this={scrollRegion}
				onscroll={handleScroll}
			>
				{@render children()}
			</main>
		</div>
	</div>

	{#if showMenu}
		<!-- Mobile: Bottom bar -->
		<Navigation
			layout="bar"
			class="fixed bottom-0 left-0 right-0 z-30 border-t border-surface-200-800 bg-surface-50-950/95 backdrop-blur md:hidden"
		>
			<Navigation.Menu class="flex justify-around items-center ">
				{#each navTiles as link (link.href)}
					{@const Icon = link.icon}
					<a href={link.href} class={anchorBar} aria-label={link.labelExpanded ?? link.label}>
						<Icon class="size-5" />
						<span>{link.label}</span>
					</a>
				{/each}
			</Navigation.Menu>
		</Navigation>
	{/if}

	<Toast.Group {toaster}>
		{#snippet children(toast)}
			{@const Icon = toastIcon((toast as { type?: string })?.type)}
			<Toast {toast}>
				<Toast.Message>
					<Toast.Title class="flex items-center gap-2">
						<Icon class="size-4" />
						{toast.title}
					</Toast.Title>
					{#if toast.description}
						<Toast.Description>{toast.description}</Toast.Description>
					{/if}
				</Toast.Message>
				{#if toast.action}
					<Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
				{/if}
				<Toast.CloseTrigger />
			</Toast>
		{/snippet}
	</Toast.Group>
</div>
