<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/circle-chevron-left';
	import ArrowRight from '@lucide/svelte/icons/circle-chevron-right';

	interface NavArrowProps {
		class?: string;
		leftDisabled?: boolean;
		rightDisabled?: boolean;
		pageLeft: () => void;
		pageRight: () => void;
	}

	let {
		class: positionClass = '',
		leftDisabled = $bindable(false),
		rightDisabled = $bindable(false),
		pageLeft = () => {},
		pageRight = () => {}
	}: NavArrowProps = $props();

	const baseClass =
		'h-1/12 absolute z-10 right-5 bottom-5 grid grid-cols-2 w-[8%] items-center justify-center';
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
