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

	let buttonId = $state('')
	let imageId = $state('')
	let nameId = $state('')
	if (data_id) {
		buttonId = `${data_id}-button`
		imageId = `${data_id}-image`
		nameId = `${data_id}-name`
	}

	const defaultStyle = `flex btn preset-tonal-surface rounded-full overflow-hidden ${style}`
	const presentStyle = `flex btn preset-tonal-success rounded-full overflow-hidden ${style}`
	const absentStyle = `flex btn preset-tonal-error rounded-full overflow-hidden ${style}`

	const fullAvatarStyle = `h-full -ml-1 ${avatarStyle}`
	const fullNameStyle = ` grow ${nameStyle}`
</script>

{#if ourLog?.here === 'present'}
	<button data-id={buttonId} class={presentStyle} onclick={onClick}>
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
	</button>
{:else if ourLog?.here === 'absent'}
	<button data-id={buttonId} class={absentStyle} onclick={onClick}>
		{#if person.avatar}
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
	</button>
{:else}
	<button data-id={buttonId} class={defaultStyle} onclick={onClick}>
		{#if person.avatar}
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
	</button>
{/if}
