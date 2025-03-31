<script lang="ts">
	import { slideStyle } from "$lib";
	type PropData = {
		data_id?: string
	}
	let { data_id = Math.random().toString(36).substring(7) }: PropData = $props()

</script>

<img
	data-id={data_id}
	data-transition="slide"
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
