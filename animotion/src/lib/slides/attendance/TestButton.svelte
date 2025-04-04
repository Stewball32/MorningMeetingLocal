<script lang="ts">
	interface Props {
		answer?: boolean
	}

	let { answer = undefined }: Props = $props()

	const baseStyle = `btn h-12 w-12 overflow-hidden rounded-full`
	const undefinedStyle = `preset-tonal-surface ${baseStyle}`
	const trueStyle = `preset-tonal-success ${baseStyle}`
	const falseStyle = `preset-tonal-error ${baseStyle}`
	const styleMap = {
		default: undefinedStyle,
		yes: trueStyle,
		no: falseStyle
	}
	let answerString: "default" | "yes" | "no" = $derived(answer === undefined ? "default" : answer ? "yes" : "no")

	let currentStyle = $derived(styleMap[answerString])
</script>

	<button
		class={currentStyle}
		onclick={() => (answer = !answer)}
	>
		<span class="material-symbols-outlined">
			{#if answer === undefined}
				??
			{:else if answer}
				True
			{:else}
				False
			{/if}
		</span>
	</button>