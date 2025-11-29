<script lang="ts">
	import type { LayoutData } from './$types';
	import '../app.css';
	import { ArrowLeftRightIcon, BikeIcon, BookIcon, HouseIcon, TreePalmIcon } from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const links = [
		{ label: 'Home', href: '#', icon: HouseIcon },
		{ label: 'Entertainment', href: '#', icon: BookIcon },
		{ label: 'Recreation', href: '#', icon: BikeIcon },
		{ label: 'Relaxation', href: '#', icon: TreePalmIcon }
	];

	const windowWidth = $state(1920); //px

	const buttonClasses = 'btn hover:preset-tonal';
	let anchorRail = `${buttonClasses} aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5`;
	let anchorSidebar = `${buttonClasses} justify-start px-2 w-full`;

	let layoutRail = $state(true);

	function toggleLayout() {
		layoutRail = !layoutRail;
	}
</script>

<svelte:head>
	<title>Morning Meeting</title>
</svelte:head>

<div
	class="grid h-screen w-screen grid-rows-[1fr_auto] overflow-hidden border-[1px] md:grid-cols-[auto_1fr] md:grid-rows-none"
>
	<Navigation
		layout={layoutRail ? 'bar' : 'sidebar'}
		class={layoutRail
			? ''
			: 'border-1  grid grid-rows-[1fr_auto] gap-4 overflow-hidden border-purple-500'}
	>
		<Navigation.Header>
			<button type="button" class={layoutRail ? anchorRail : anchorSidebar} onclick={toggleLayout}>
				<ArrowLeftRightIcon class={layoutRail ? 'size-5' : 'size-4'} />
				{#if !layoutRail}<span>Resize</span>{/if}
			</button>
		</Navigation.Header>
		<Navigation.Content class="border border-green-400">
			<Navigation.Menu class="border border-amber-400">
				{#each links as link (link)}
					{@const Icon = link.icon}
					<a href={link.href} class={layoutRail ? anchorRail : anchorSidebar}>
						<Icon class={layoutRail ? 'size-5' : 'size-4'} />
						<span class={layoutRail ? 'text-[10px]' : ''}>{link.label}</span>
					</a>
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
	</Navigation>
	<div
		class=" flex items-center justify-center overflow-auto bg-gradient-to-br from-blue-300 to-red-300"
	>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
	</div>
</div>
