<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { getGuestAvatar } from '$lib/pb';
	import type { GuestAvatar, GuestDaily } from '$lib/pb/types';
	import { onMount } from 'svelte';
	import Button from './+button.svelte';

	interface Props {
		guest: GuestDaily;
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
		guestAvatarMap?: Map<string, GuestAvatar>;
		onClick?: () => void;
	}

	const {
		guest: guest,
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
		guestAvatarMap,
		onClick
	}: Props = $props();

	let avatarRecord = $state<GuestAvatar | null>(null);
	onMount(async () => {
		if (guestAvatarMap && guestAvatarMap.has(guest.avatar)) {
			avatarRecord = guestAvatarMap.get(guest.avatar) || null;
		} else {
			avatarRecord = await getGuestAvatar(guest.avatar);
		}
		if (!avatarRecord) {
			console.error('Avatar not found for guest:', guest.avatar);
		}
	});

	let imageUrl = $derived(
		avatarRecord
			? `${PUBLIC_POCKETBASE_URL}/api/files/${avatarRecord.collectionId}/${avatarRecord.id}/${avatarRecord.image}`
			: '/default_guest_avatar.png'
	);
	let text = $derived(`${guest.title || ''} ${guest.name}`.trimStart());
	let imgAlt = $derived(`${guest.title || ''} ${guest.name}`.trimStart());
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
