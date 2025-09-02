<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div>
	<h1>Classrooms</h1>
	<h1>H1</h1>
	<h2>H2</h2>
	<h3>H3</h3>
	<h4>H4</h4>
	<h5>H5</h5>
	<h6>H6</h6>
	<h7>H7</h7>
	<p>Paragraph</p>
	<p>Data: {JSON.stringify(data)}</p>
</div>
