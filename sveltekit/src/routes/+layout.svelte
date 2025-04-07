<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>


<svelte:head>
	<title>Morning Meeting</title>
</svelte:head>


<div class="relative min-h-screen">

	{@render children()}
</div>
