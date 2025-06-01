<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import type { Student, StudentDaily, Teacher, TeacherDaily } from '$lib/pb/types';
	import Button from './+button.svelte';

	interface Props {
		person: Student | Teacher;
		orientation?: 'horizontal' | 'vertical';
		buttonClass?: string;
		avatarClass?: string;
		nameClass?: string;
		showAvatar?: boolean;
		showName?: boolean;
		buttonPreset?:
			| 'primary'
			| 'secondary'
			| 'tertiary'
			| 'success'
			| 'warning'
			| 'error'
			| 'surface';
		overrideButtonClass?: boolean;
		overrideAvatarClass?: boolean;
		overrideNameClass?: boolean;
		disableButton?: boolean;
		onClick?: () => void;
	}

	const {
		person,
		orientation = 'horizontal',
		buttonClass = '',
		avatarClass = '',
		nameClass = '',
		showAvatar = true,
		showName = true,
		buttonPreset,
		overrideButtonClass,
		overrideAvatarClass,
		overrideNameClass,
		disableButton,
		onClick
	}: Props = $props();

	let imageUrl = $derived(
		person.avatar
			? `${PUBLIC_POCKETBASE_URL}/api/files/${person.collectionId}/${person.id}/${person.avatar}`
			: ''
	);
	let text = $derived(`${person.title || ''} ${person.name}`.trimStart());
	let imgAlt = $derived(`${person.title || ''} ${person.name}`.trimStart());
</script>

<Button
	{imageUrl}
	{text}
	{imgAlt}
	{orientation}
	{buttonPreset}
	{buttonClass}
	imageClass={avatarClass}
	textClass={nameClass}
	{overrideButtonClass}
	showImage={showAvatar}
	overrideImageClass={overrideAvatarClass}
	showText={showName}
	overrideTextClass={overrideNameClass}
	disable={disableButton}
	{onClick}
/>
