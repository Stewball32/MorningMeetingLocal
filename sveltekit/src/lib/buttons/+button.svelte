<script lang="ts">

	interface Props {
		imageUrl?: string
		text?: string
		imgAlt?: string
		orientation?: 'horizontal' | 'vertical'
		btnPreset?: "primary" | "secondary" | "tertiary" | "success" | "warning" | "error" | "surface"
		overrideStyle?: string
		btnClass?: string
		imgClass?: string
		strClass?: string
		overrideBtn?: boolean
		showImg?: boolean
		overrideImgClass?: boolean
		showText?: boolean
		overrideTextClass?: boolean
		disable?: boolean
		onClick?: () => void
	}

	const {
		imageUrl = "",
		text = "",
		imgAlt = "",
		orientation = "horizontal",
		btnPreset = "surface",
		btnClass = "",
		imgClass = "",
		strClass = "",
		overrideBtn = false,
		showImg = true,
		overrideImgClass = false,
		showText = true,
		overrideTextClass = false,
		disable = false,
		onClick,
	}: Props = $props()

	const baseClass = `flex btn relative overflow-hidden rounded-full border items-center justify-center`
	const orientationClass = orientation === "vertical" ? "flex-col" : "flex-row"
	const presetMap = {
		surface: `preset-tonal-surface ${baseClass}`,
		primary: `preset-tonal-primary ${baseClass}`,
		secondary: `preset-tonal-secondary ${baseClass}`,
		tertiary: `preset-tonal-tertiary ${baseClass}`,
		success: `preset-tonal-success ${baseClass}`,
		warning: `preset-tonal-warning ${baseClass}`,
		error: `preset-tonal-error ${baseClass}`,
	}
	
	const baseButtonClass = `${presetMap[btnPreset]} ${orientationClass}`
	let buttonClass = $derived( overrideBtn ? btnClass : baseButtonClass + ` ${btnClass}`)

	const baseImageClass = `aspect-auto`
	let imageClass = $derived(overrideImgClass ? imgClass : baseImageClass + ` ${imgClass}`)

	const baseStringClass = `text-center`
	let stringClass = ` ${strClass}`


</script>


<button  class={buttonClass} onclick={onClick}>
	{#if showImg}
		<img src={imageUrl} alt={imgAlt} class={imageClass} />
	{/if}
	{#if showText}
		<h3 class={stringClass}>
			{text}
		</h3>
	{/if}
</button>