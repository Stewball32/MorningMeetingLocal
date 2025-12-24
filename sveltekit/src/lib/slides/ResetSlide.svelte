<script lang="ts">
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	interface ResetProps {
		onclick?: () => {};
	}

	let { onclick } = $props();
</script>

<div class="absolute bottom-0 left-0 z-10 flex h-[4%] items-center justify-center">
	<button {onclick} class="btn preset-tonal-error aspect-square h-full rounded-full border p-0">
		<RotateCcw class="m-0 h-full p-0" />
	</button>
</div>
