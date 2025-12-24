<script lang="ts">
	import type { LayoutData } from './$types';
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { navTiles, navFooter } from './nav';
	import { Avatar, Navigation } from '@skeletonlabs/skeleton-svelte';
	import { onNavigate } from '$app/navigation';
	import IconHome from '@lucide/svelte/icons/home';
	import IconMenu from '@lucide/svelte/icons/menu';

	let { data, children, pathname }: { data: LayoutData; children: Snippet; pathname: string } =
		$props();

	let showNav = $state(data.showMenu ?? true);
	const noMenuPaths = $state(data.noMenuPaths ?? []);
	onNavigate((e) => {
		showNav = !noMenuPaths.some((path) => e.to?.url.pathname.startsWith(path));
		pathname = e.to?.url.pathname ?? '';
	});

	let isExpanded = $state(false);

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	let gridClass = $derived(
		showNav
			? 'grid grid-rows-[1fr_auto] border-[1px] md:grid-cols-[auto_1fr] md:grid-rows-none md:'
			: ''
	);
	let bgClass = $state('bg-linear-to-br/oklch from-purple-300 via-green-200 to-purple-300');
	let anchorRailClass =
		'btn hover:preset-tonal aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5';
</script>

<svelte:head>
	<title>Morning Meeting</title>
</svelte:head>

<div
	class={`card border-surface-100-900 h-screen w-screen
          ${gridClass} ${bgClass}`}
>
	{#if showNav}
		<Navigation
			layout={isExpanded ? 'sidebar' : 'bar'}
			class="hidden h-full flex-col overflow-y-auto md:flex "
		>
			<Navigation.Header>
				<button onclick={toggleExpanded} class="flex h-10 w-full items-center justify-center">
					<IconMenu />
				</button>
				<a href="/" class={anchorRailClass} title="Home" aria-label="Home">
					<IconHome class="size-8" />
				</a>
			</Navigation.Header>

			<Navigation.Content>
				<Navigation.Menu>
					{#each navTiles.filter((tile) => tile.rail || tile.railExpanded === isExpanded) as tile}
						<a href={tile.href} class={anchorRailClass}>
							<tile.icon class="size-5" />
							<span class="text-xs">{isExpanded ? tile.labelExpanded : tile.label}</span>
						</a>
					{/each}
				</Navigation.Menu>
			</Navigation.Content>

			<Navigation.Footer>
				<Avatar>
					<Avatar.Fallback class="hidden text-xl 2xl:block">2XL</Avatar.Fallback>
					<Avatar.Fallback class="hidden text-xl xl:block 2xl:hidden">XL</Avatar.Fallback>
				</Avatar>
			</Navigation.Footer>
		</Navigation>
	{/if}

	<div class="flex h-full w-full flex-col overflow-y-auto">
		{@render children()}
	</div>

	<!-- {#if showMenu}
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
			<Navigation.Tile
				base="block"
				labelExpanded={'Size'}
				labelExpandedBase={'text-2xl'}
				expandedClasses={'mt-4'}
				title={'Size'}
				id={'size'}
			>
				<Avatar classes="hidden 2xl:block text-xl" name="2 Extra Large">2XL</Avatar>
				<Avatar classes="hidden xl:block 2xl:hidden text-xl" name="Extra Large">XL</Avatar>
				<Avatar classes="hidden lg:block xl:hidden text-xl" name="Large">LG</Avatar>
				<Avatar classes="hidden md:block lg:hidden text-xl" name="Medium">MD</Avatar>
				<Avatar classes="hidden sm:block md:hidden text-xl" name="Small">SM</Avatar>
				<Avatar classes="block sm:hidden text-xl" name="Mobile">MB</Avatar>
			</Navigation.Tile>
		</Navigation.Bar>
	{/if} -->
</div>
