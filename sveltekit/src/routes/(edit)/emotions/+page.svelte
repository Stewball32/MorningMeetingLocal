<script lang="ts">
	import type { PageData } from '../emotions/$types';

	let { data }: { data: PageData } = $props();
</script>

<div>
	<h1>Slides</h1>
	<p>Data: {JSON.stringify(data)}</p>
</div>
