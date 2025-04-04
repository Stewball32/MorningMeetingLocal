<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
	import type { Student, StudentLog, Teacher, TeacherLog } from '$lib/pb'

	interface Props {
		person: Student | Teacher
		logMap?: Map<string, StudentLog | TeacherLog>
		data_id?: string
		style?: string
		showAvatar?: boolean
		avatarStyle?: string
		showName?: boolean
		nameStyle?: string
		onClick?: () => void
	}

	const {
		person,
		logMap,
		style = '',
		showAvatar = true,
		avatarStyle = '',
		showName = true,
		nameStyle = '',
		onClick,
		data_id
	}: Props = $props()

	const ourLog = $derived(logMap?.get(person.id) as StudentLog | TeacherLog | undefined)

	const avatarUrl = $derived(
		person.avatar
			? `${PUBLIC_POCKETBASE_URL}/api/files/${person.collectionId}/${person.id}/${person.avatar}`
			: undefined
	)

	let buttonId = $derived(data_id ? `${data_id}-button` : '')
	let imageId = $derived(data_id ? `${data_id}-image` : '')
	let nameId = $derived(data_id ? `${data_id}-name` : '')

	const baseStyle = `flex btn overflow-hidden`
	const defaultStyle = `preset-tonal-surface ${baseStyle} ${style}`
	const presentStyle = `preset-tonal-success rounded-full ${baseStyle} ${style}`
	const absentStyle = `preset-tonal-error rounded-full ${baseStyle} ${style}`
	const styleMap = {
		default: defaultStyle,
		present: presentStyle,
		absent: absentStyle
	}
	const buttonStyle = $derived(ourLog && ourLog.here !== "" ? styleMap[ourLog.here] : styleMap.default)

	const fullAvatarStyle = `h-full -ml-1 ${avatarStyle}`
	const fullNameStyle = `grow ${nameStyle}`
</script>

<button data-id={buttonId} class={buttonStyle} onclick={onClick}>
	{#if person.avatar && showAvatar}
		<img data-id={imageId} src={avatarUrl} alt={person.name} class={fullAvatarStyle} />
	{/if}
	{#if showName}
		<h4 data-id={nameId} class={fullNameStyle}>
			{#if person.title}
				{person.title} {person.name}
			{:else}
				{person.name}
			{/if}
		</h4>
	{/if}
	<p>{ourLog?.here ?? "?"}</p>
</button>
