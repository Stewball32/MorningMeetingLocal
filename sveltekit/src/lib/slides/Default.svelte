<script lang="ts">
	export let id: string | null = null;
	export let animate = false;
	export let restart = false;
</script>

<section
	data-auto-animate-id={id}
	data-auto-animate={animate || null}
	data-auto-animate-restart={restart || null}
	class="flex flex-col h-full w-full p-[5%]"
>
		<img class="absolute z-0 h-full w-full " src="/paper.svg" alt="" />
		<section
		data-auto-animate-id={id}
		data-auto-animate={animate || null}
		data-auto-animate-restart={restart || null}>
			<slot />
		</section>
</section>
