<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>


<svelte:head>
	<title>Morning Meeting</title>
</svelte:head>

<div class="absolute right-0 top-0 z-10 text-xl text-blue-600">
	<p class="block sm:hidden">XS</p>
	<p class="hidden sm:block md:hidden">SM</p>
	<p class="hidden md:block lg:hidden">MD</p>
	<p class="hidden lg:block xl:hidden">LG</p>
	<p class="hidden xl:block 2xl:hidden">XL</p>
	<p class="hidden 2xl:block">2XL</p>
</div>

<div class="relative min-h-screen min-w-screen">

	{@render children()}
</div>
