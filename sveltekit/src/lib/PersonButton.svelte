<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
	import type { Student, StudentDaily, Teacher, TeacherDaily } from './pb/types';

	interface Props {
		person: Student | Teacher
		daily?: StudentDaily | TeacherDaily
		style?: string
		forceStyle?: 'default' | 'present' | 'absent'
		showAvatar?: boolean
		avatarStyle?: string
		showName?: boolean
		nameStyle?: string
		onClick?: () => void
	}

	const {
		person,
		daily,
		style = '',
		forceStyle,
		showAvatar = true,
		avatarStyle = '',
		showName = true,
		nameStyle = '',
		onClick,
	}: Props = $props()

	const baseStyle = `flex btn relative overflow-hidden rounded-full border`
	const defaultStyle = `preset-tonal-surface ${baseStyle} ${style}`
	const presentStyle = `preset-tonal-success ${baseStyle} ${style}`
	const absentStyle = `preset-tonal-error  ${baseStyle} ${style}`
	const styleMap = {
		default: defaultStyle,
		present: presentStyle,
		absent: absentStyle
	}
	let buttonStyle = $derived(forceStyle ? styleMap[forceStyle] : daily && daily.here !== "" ? styleMap[daily.here] : styleMap.default)

	const fullAvatarStyle = `aspect-auto ${avatarStyle}`
	const fullNameStyle = ` ${nameStyle}`

	let avatarUrl = $derived(
		person.avatar
			? `${PUBLIC_POCKETBASE_URL}/api/files/${person.collectionId}/${person.id}/${person.avatar}`
			: undefined
	)

</script>


<button  class={buttonStyle} onclick={onClick}>
	{#if person.avatar && showAvatar}
		<img src={avatarUrl} alt={person.name} class={fullAvatarStyle} />
	{/if}
	{#if showName}
		<h3 class={fullNameStyle}>
			{#if person.title}
				{person.title} {person.name}
			{:else}
				{person.name}
			{/if}
		</h3>
	{/if}
</button>