<script lang="ts">

	let { children } = $props();
</script>


<div class="relative min-h-screen">

	<img
	src="/paper.svg"
	class="
		absolute
		aspect-[16/9]
		w-[320px]
		sm:w-[640px]
		md:w-[768px]
		lg:w-[1024px]
		xl:w-[1280px]
		2xl:w-[1536px]
		max-w-full
		overflow-hidden
		"
	alt=""
/>
	{@render children()}
</div>
