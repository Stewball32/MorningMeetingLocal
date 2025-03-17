<script lang="ts">
	import { onMount } from 'svelte'

	import Reveal from 'reveal.js'
	import Highlight from 'reveal.js/plugin/highlight/highlight'
	import Markdown from 'reveal.js/plugin/markdown/markdown'
	import Notes from 'reveal.js/plugin/notes/notes'

	import 'reveal.js/dist/reveal.css'
	import 'reveal.js/dist/theme/sky.css'
	import 'reveal.js/plugin/highlight/monokai.css'

	// Import ABeeZee font from @fontsource/abeezee
	import '@fontsource/abeezee';

	import Presentation from '$lib/deck/Presentation.svelte'

	onMount(() => {
		const deck = new Reveal({
			plugins: [Markdown, Highlight, Notes],
			autoAnimateEasing: 'ease',
			autoAnimateDuration: 1,
			hash: true
		})

		deck.initialize()
	})
</script>

<div class="reveal bg-gradient-to-r from-cyan-500 to-blue-500">
	<div class="slides w-full h-full ">
		<Presentation />
	</div>
</div>

<style>

* {
	text-transform: none;
}
	/* Override the fonts for the Reveal.js presentation */
.reveal {
	font-family: 'ABeeZee', sans-serif;
}

/* You can also target headings and specific elements */
h1, 
h2, 
h3, 
h4, 
h5, 
h6 {
	font-family: 'ABeeZee', sans-serif;
	font-weight: normal;
	text-transform: none; /* Disable all-caps */
}


/* Override other components if needed */
.reveal p, 
.reveal li, 
.reveal blockquote {
	font-family: 'ABeeZee', sans-serif;
}

/* Override for the code block styles if needed */
.reveal code,
.reveal pre {
	font-family: 'JetBrains Mono', monospace;
}
</style>