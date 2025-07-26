<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex h-full flex-col items-center justify-center">
	<span class="text-error-600-400 h1 mb-4 font-bold">Error</span>
	<p class="text-surface-950-50 mb-2">An error occurred while processing your request.</p>
	<p class="text-surface-900-100 mb-6">Please try again later or contact support.</p>
	<a class="btn preset-filled btn-lg rounded-2xl" href="/">Go to Home</a>
	<!-- <button class="btn preset-filled" onclick={() => window.location.reload()}> Reload Page </button> -->

	{#if page.status === 404}
		<span class="h2 text-error-700-300 mt-4">Page Not Found</span>
		<p class="text-surface-900-100">The page you are looking for does not exist.</p>
	{:else if page.status === 500}
		<span class="h2 text-error-700-300 mt-4">Internal Server Error</span>
		<p class="text-surface-900-100">Something went wrong on our end. Please try again later.</p>
	{/if}
</div>
