<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div>
	<h1>Settings</h1>
	<p>Data: {JSON.stringify(data)}</p>
</div>
