<script lang="ts">
	import type { PageData } from '../images/$types';

	let { data }: { data: PageData } = $props();
</script>

<div>
	<h1>Slides</h1>
	<p>Data: {JSON.stringify(data)}</p>
</div>
