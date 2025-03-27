<script lang="ts">
	import '../styles/app.css'

	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
	<title>Morning Meeting</title>
</svelte:head>

{@render children()}