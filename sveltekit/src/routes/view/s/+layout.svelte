<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let wrapper = $state<HTMLDivElement | null>(null);
	let scale = $state(1);
	const scaleFactor = 0.98; // optional factor to add some padding

	function zoomIn() {
		scale = Math.min(scale + 0.05, 2); // cap at 200%
	}

	function zoomOut() {
		scale = Math.max(scale - 0.05, 0.1); // floor at 10%
	}

	function resetZoom() {
		wrapper = document.getElementById('slide-wrapper') as HTMLDivElement;
		const scaleWidth = wrapper.clientWidth / 1920; // your slide width
		const scaleHeight = wrapper.clientHeight / 1080; // your slide height
		scale = Math.min(scaleWidth, scaleHeight) * scaleFactor;
	}

	// optional: reset to fit-to-width on mount
	onMount(() => {
		resetZoom();
	});
	let style = $derived(`transform: scale(${scale}); transform-origin: center center;`);
</script>

<div
	id="slide-wrapper"
	class="flex h-full w-full items-center justify-center overflow-hidden align-middle"
>
	<div
		id="slide"
		class="relative aspect-[16/9] h-[1080px] w-[1920px] select-none overflow-visible"
		{style}
	>
		<img src="/paper.svg" draggable="false" class="absolute inset-0 h-full w-full" alt="" />
		<div
			class="absolute inset-0 mb-[10px] ml-[143px] mr-[6px] mt-[4px] origin-top-left overflow-hidden rounded-br-[65px] rounded-tr-[65px]"
		>
			{@render children()}
		</div>
	</div>
</div>

<div
	class="fixed right-4 top-4 z-50 flex select-none items-center space-x-2 rounded bg-black/60 p-2"
>
	<button
		class="rounded bg-white px-2 py-1 text-black hover:bg-gray-200"
		onclick={zoomOut}
		aria-label="Zoom out"
	>
		<span class="select-none"> − </span>
	</button>

	<button
		class="rounded bg-white px-2 py-1 text-black hover:bg-gray-200"
		onclick={resetZoom}
		aria-label="Reset zoom"
	>
		<!-- use a reset icon or text -->
		<span class="select-none"> ↻ </span>
	</button>
	<button
		class="rounded bg-white px-2 py-1 text-black hover:bg-gray-200"
		onclick={zoomIn}
		aria-label="Zoom in"
	>
		<span class="select-none"> + </span>
	</button>
</div>
