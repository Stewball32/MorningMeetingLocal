<script lang="ts">
	import { slideStyle } from '$lib';

	let { children } = $props();
</script>

<div class="place-items-center">
	<!-- <h1> Current thing</h1> -->
	<div class=" relative min-h-screen place-content-center">
		<img
			src="/paper.svg"
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

		<div class={slideStyle + '  '}>
			{@render children()}
		</div>
	</div>
</div>
