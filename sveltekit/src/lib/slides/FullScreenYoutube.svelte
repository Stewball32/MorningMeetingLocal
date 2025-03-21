<script lang="ts">
	export let id: string | null = null;
	export let animate = false;
	export let restart = false;
	export let youtubeId = '';
</script>

<section
	data-auto-animate-id={id}
	data-auto-animate={animate || null}
	data-auto-animate-restart={restart || null}
	class="h-full w-full"
>
	<!-- svelte-ignore a11y_missing_attribute -->
	<iframe
	width="100%"
	height="100%"
	src={`https://www.youtube.com/embed/${youtubeId}`}
	frameborder="0" 
	allow="encrypted-media" >
</iframe>
</section>
