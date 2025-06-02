<script lang="ts">
	import Maximize from '@lucide/svelte/icons/maximize';
	import Minimize from '@lucide/svelte/icons/minimize';
	import X from '@lucide/svelte/icons/x';
	import { slideStyle } from '$lib';
	import { onDestroy, onMount } from 'svelte';

	let { children } = $props();

	let isFullscreen = $state(!!document.fullscreenElement);

	const toggleFullscreen = () => {
		if (isFullscreen) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
	};

	// update our flag whenever the browser fires fullscreenchange
	function updateState() {
		isFullscreen = !!document.fullscreenElement;
	}

	onMount(() => {
		// sync initial value (in case you start in FS already)
		updateState();
		// listen for changes
		document.addEventListener('fullscreenchange', updateState);
	});

	onDestroy(() => {
		document.removeEventListener('fullscreenchange', updateState);
	});

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key === 'F11') {
			event.preventDefault();
			toggleFullscreen();
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

<div class="absolute right-1 top-1 z-10 grid grid-cols-1 gap-[10%]">
	<button
		onclick={toggleFullscreen}
		class="btn transparent- preset-filled-surface-400-600 m-0 border-2 p-[1%]"
	>
		{#if isFullscreen}
			<Minimize class="" />
		{:else}
			<Maximize class="" />
		{/if}
	</button>
</div>
<div class="place-items-center">
	<!-- <h1> Current thing</h1> -->
	<div class="relative min-h-screen select-none place-content-center">
		<img
			src="/paper.svg"
			draggable={false}
			class="
        3xl:w-[1920px]
				absolute
				aspect-[16/9]
				w-[320px]
				max-w-full
				overflow-hidden
				sm:w-[640px]
				md:w-[768px]
				lg:w-[1024px]
        xl:w-[1280px]
        2xl:w-[1536px]
			"
			alt=""
		/>

		<div class={slideStyle + ' select-none'}>
			{@render children()}
		</div>
	</div>
</div>
