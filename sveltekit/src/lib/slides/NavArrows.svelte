<script lang="ts">
	import type { ClassDaily } from '$lib/pb/types';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	interface NavArrowProps {
		classDaily: ClassDaily;
		page: number;
		totalSlides: number;
		positionClass?: string;
		leftDisabled?: boolean;
		rightDisabled?: boolean;
		pageLeft: () => void;
		pageRight: () => void;
	}

	let {
		classDaily,
		page = 0,
		totalSlides = 1,
		positionClass = 'right-1 bottom-1',
		leftDisabled = $bindable(false),
		rightDisabled = $bindable(false),
		pageLeft = () => {},
		pageRight = () => {}
	}: NavArrowProps = $props();

	const baseClass = 'h-1/12 absolute z-10 grid grid-cols-2 w-[8%] items-center justify-center';
</script>

<div class={`${baseClass} ${positionClass}`}>
	<button
		class="cursor-pointer disabled:cursor-not-allowed"
		onclick={pageLeft}
		disabled={leftDisabled}
	>
		<ArrowLeft class="h-full w-full hover:scale-110 active:scale-90" />
	</button>
	<button
		class="cursor-pointer disabled:cursor-not-allowed"
		onclick={pageRight}
		disabled={rightDisabled}
	>
		<ArrowRight class="h-full w-full hover:scale-110 active:scale-90 " />
	</button>
</div>
