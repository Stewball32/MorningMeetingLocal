<script lang="ts">
	import type { LayoutData } from './$types';
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { navTiles, navFooter } from './nav';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { onNavigate } from '$app/navigation';
	import IconHome from '@lucide/svelte/icons/home';
	import IconMenu from '@lucide/svelte/icons/menu';

	let { data, children, pathname }: { data: LayoutData; children: Snippet; pathname: string } =
		$props();

	let showMenu = $state(data.showMenu ?? true);
	const noMenuPaths = $state(data.noMenuPaths ?? []);
	onNavigate((e) => {
		showMenu = !noMenuPaths.some((path) => e.to?.url.pathname.startsWith(path));
		pathname = e.to?.url.pathname ?? '';
	});

	let isExpansed = $state(false);

	function toggleExpanded() {
		isExpansed = !isExpansed;
	}

	let gridClass = $derived(
		showMenu
			? 'grid grid-rows-[1fr_auto] border-[1px] md:grid-cols-[auto_1fr] md:grid-rows-none'
			: ''
	);
	let bgClass = $state('bg-gradient-to-br from-blue-400 to-blue-600');
</script>

<svelte:head>
	<title>Morning Meeting</title>
</svelte:head>

<div
	class={`card border-surface-100-900 h-screen w-screen
          ${gridClass} ${bgClass}`}
>
	{#if showMenu}
		<Navigation.Rail expanded={isExpansed} classes="hidden md:flex h-full overflow-y-auto ">
			{#snippet header()}
				<Navigation.Tile
					classes="h-10  w-full flex items-center justify-center"
					expandedClasses="h-10  w-full flex items-center justify-center"
					onclick={toggleExpanded}
				>
					<IconMenu />
				</Navigation.Tile>
				<Navigation.Tile
					labelExpanded="Home"
					labelExpandedBase="text-2xl h-10"
					href="/"
					title="Home"
					id="/"
					selected={pathname === '/'}
				>
					<IconHome />
				</Navigation.Tile>
			{/snippet}

			{#snippet tiles()}
				{#each navTiles.filter((tile) => tile.rail || tile.railExpanded === isExpansed) as tile}
					<Navigation.Tile
						labelExpanded={tile.labelExpanded}
						labelExpandedBase={tile.rail ? 'text-lg' : 'text-xs'}
						expandedClasses={tile.rail ? 'mt-4 h-10' : 'pl-10 my-0 py-0 h-10'}
						href={tile.href}
						title={tile.label}
						id={tile.href}
						selected={pathname === tile.href}
					>
						<tile.icon />
					</Navigation.Tile>
				{/each}
			{/snippet}

			{#snippet footer()}
				{#each navFooter.filter((tile) => tile.rail || tile.railExpanded === isExpansed) as tile}
					<Navigation.Tile
						labelExpanded={tile.labelExpanded}
						labelExpandedBase={tile.rail ? 'text-2xl' : 'text-lg'}
						expandedClasses={tile.rail ? 'mt-4' : 'pl-10 my-0 py-0'}
						href={tile.href}
						title={tile.label}
						id={tile.href}
						selected={pathname === tile.href}
					>
						<tile.icon />
					</Navigation.Tile>
				{/each}
			{/snippet}
		</Navigation.Rail>
	{/if}

	<div class="flex h-full w-full flex-col overflow-y-auto">
		{@render children()}
	</div>

	{#if showMenu}
		<Navigation.Bar classes="md:hidden overflow-x-auto">
			<Navigation.Tile label="Home" href="/" title="Home" id="/" selected={pathname === '/'}>
				<IconHome />
			</Navigation.Tile>
			{#each [...navTiles, ...navFooter].filter((tile) => tile.bar) as tile}
				<Navigation.Tile
					label={tile.label}
					href={tile.href}
					title={tile.label}
					id={tile.href}
					selected={pathname === tile.href}
				>
					<tile.icon />
				</Navigation.Tile>
			{/each}
		</Navigation.Bar>
	{/if}
</div>
