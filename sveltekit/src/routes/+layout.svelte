<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>


<svelte:head>
	<title>Morning Meeting</title>
</svelte:head>


{@render children()}
