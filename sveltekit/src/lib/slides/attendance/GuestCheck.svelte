<script lang="ts">
	import type { GuestAvatar, GuestDaily } from '$lib/pb/types';
	import { onMount } from 'svelte';
	import type { ClassProps } from './_types';
	import { Combobox, Modal, Popover } from '@skeletonlabs/skeleton-svelte';
	import Undo from '@lucide/svelte/icons/Undo';
	import UserRoundPlus from '@lucide/svelte/icons/user-round-plus';
	import Trash from '@lucide/svelte/icons/trash-2';
	import TvMinimalPlay from '@lucide/svelte/icons/tv-minimal-play';
	import { createGuestDaily, deleteGuestDaily, getGuestDailiesRange, getPbImageUrl } from '$lib/pb';
	import GuestButton from '$lib/buttons/GuestButton.svelte';
	import SampleButton from '$lib/buttons/+button.svelte';

	interface GuestCheckProps {
		hasGuests?: boolean;
		guestDailies?: GuestDaily[];
		welcomeGuests?: boolean;
		guestAvatarMap?: Map<string, GuestAvatar>;
		pageLeft: () => void;
		pageRight: () => void;
		updateClassDailyAttendance: (partialClassDailyAttendance: Partial<ClassProps>) => Promise<void>;
	}

	interface ComboboxData {
		label: string;
		value: string;
		emoji: string;
	}

	let {
		hasGuests = $bindable(undefined),
		guestDailies = $bindable([]),
		welcomeGuests = $bindable(false),
		guestAvatarMap = $bindable(new Map<string, GuestAvatar>()),
		pageLeft = () => {},
		pageRight = () => {},
		updateClassDailyAttendance = async (partialClassDailyAttendance: Partial<ClassProps>) => {}
	}: GuestCheckProps = $props();

	const updateHasGuests = (answer?: boolean) => {
		hasGuests = hasGuests === answer ? undefined : answer;
		updateClassDailyAttendance({ hasGuests: hasGuests });
	};
	const updateWelcomeGuests = () => {
		welcomeGuests = !welcomeGuests;
		updateClassDailyAttendance({ welcomeGuests: welcomeGuests });
	};

	let previousGuests: GuestDaily[] = $state([]);
	let guestComboboxArray: ComboboxData[] = $state([]);
	let avatarComboboxArray: ComboboxData[] = $state([]);
	guestAvatarMap.values().forEach((avatar) => {
		avatarComboboxArray.push({
			label: avatar.name,
			value: avatar.id,
			emoji: avatar.emoji
		});
	});
	onMount(async () => {
		const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
		const [year, month, day] = [
			yesterday.getFullYear(),
			yesterday.getMonth() + 1,
			yesterday.getDate()
		];
		const afterDate = month < 8 ? `${year - 1}-08-01` : `${year}-08-01`;
		const beforeDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

		previousGuests = await getGuestDailiesRange({ after: afterDate, before: beforeDate });
		previousGuests.forEach((guestDaily) => {
			let emoji = guestAvatarMap.get(guestDaily.avatar)?.emoji || '❔';
			if (guestComboboxArray.some((guest) => guest.label === guestDaily.name)) return;
			guestComboboxArray.push({
				label: guestDaily.name,
				value: guestDaily.id,
				emoji: emoji
			});
		});
	});

	let selectedGuestName: string[] = $state([]);
	let modalGuestName: string = $state('');
	let selectedAvatarId: string[] = $state([]);
	let selectedPronoun: 'he' | 'she' | undefined = $state(undefined);
	let modalOpen = $state(false);
	const resetModal = (closeModal: boolean = true) => {
		selectedGuestName = [];
		selectedAvatarId = [];
		selectedPronoun = undefined;
		modalGuestName = '';
		if (closeModal) modalOpen = false;
	};

	const reusePreviousGuest = (e: any) => {
		console.log('Selected Guest', e);
		let guest = previousGuests.find((guest) => guest.id === e.value[0]);
		console.log('Guest', guest);
		selectedPronoun = guest?.pronoun || undefined;
		selectedGuestName = [guest?.name || e.label];
		selectedAvatarId = [guest?.avatar ?? ''];
	};

	const updateModalGuestName = (guest: any) => {
		if (guest.inputValue.length == 0 && modalGuestName.length > 1) return;
		modalGuestName = guest.inputValue;
	};

	const updateAvatar = (avatar: any) => {
		selectedAvatarId = avatar.value;
		console.log('Avatars', avatar.value);
	};

	const avatarURL = (avatarId: string) => {
		let avatar = guestAvatarMap.get(avatarId);
		if (!avatar) return '/default_guest_avatar.png';
		let url = getPbImageUrl(avatar.collectionId, avatar.id, avatar.image);
		console.log('Avatar URL', url);
		return url;
	};

	const addGuest = async (closeModal: boolean = true) => {
		if (!modalGuestName || !selectedAvatarId[0]) {
			return alert('Please select a name and an avatar!');
		}

		const newGuest = await createGuestDaily({
			name: modalGuestName,
			pronoun: selectedPronoun,
			avatar: selectedAvatarId[0]
		});
		resetModal(closeModal);
	};

	const welcomeString = () => {
		if (!guestDailies) return "Let's welcome our guests!";
		if (guestDailies.length === 1) return `Let's welcome ${guestDailies[0].name}!`;
		if (guestDailies.length > 1) {
			let dailies = guestDailies.slice(0, -1);
			let lastGuest = guestDailies[guestDailies.length - 1];
			return `Let's welcome ${dailies.map((guest) => guest.name).join(', ')} and ${lastGuest?.name}!`;
		}
	};

	let popoverOpen: boolean = $state(false);

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowLeft') {
			pageLeft();
		} else if (event.key === 'ArrowRight') {
			pageRight();
		}
	};

	const youtubeId = '0gzKRGcmnFs';
	const youtubeStart = 206;
	const youtubeEnd = 223;
	const youtubeParam = `?rel=0&enablejsapi=1&autoplay=0&start=${youtubeStart}&end=${youtubeEnd}`;
	const youtubeEmbeddedUrl = `https://www.youtube.com/embed/${youtubeId}${youtubeParam}`;
	const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}${youtubeParam}`;
</script>

<svelte:window on:keydown={onKeydown} />

{#if hasGuests != undefined}
	<div class="h-1/12 absolute bottom-2 left-2 flex w-4/12 justify-start gap-[2%]">
		<button
			class="btn preset-tonal-secondary aspect-square h-full rounded-full border p-0"
			onclick={() => (welcomeGuests ? updateWelcomeGuests() : updateHasGuests(undefined))}
		>
			<Undo class="h-full" />
		</button>
		{#if hasGuests}
			<button
				class="btn preset-tonal-primary aspect-square h-full rounded-full border p-0"
				onclick={() => (modalOpen = true)}
			>
				<UserRoundPlus class="h-full" />
			</button>
			<Popover
				open={popoverOpen}
				onOpenChange={(e) => (popoverOpen = e.open)}
				positioning={{ placement: 'right-end' }}
				triggerBase="btn preset-tonal-error aspect-square h-full rounded-full border p-0"
				contentBase="card bg-error-200-800 p-4 space-y-4"
				arrow
				arrowBackground="!bg-error-200 dark:!bg-error-800"
			>
				{#snippet trigger()}<Trash class="h-full" />{/snippet}
				{#snippet content()}
					<header class="center flex">
						<p class="text-size-1 text-center font-semibold">Delete Guest</p>
					</header>
					<article class="flex h-full flex-col items-center gap-2 overflow-y-auto">
						{#each guestDailies as guest}
							<button
								type="button"
								class="btn preset-tonal-error-500 w-full rounded-full text-left"
								onclick={() => deleteGuestDaily(guest)}
							>
								<div class="text-size-1 flex w-full justify-between space-x-2">
									<span class="truncate">{guest.name}</span>
									<span>{guestAvatarMap.get(guest.avatar)?.emoji || '❔'}</span>
								</div>
							</button>
						{/each}
					</article>
				{/snippet}
			</Popover>
			<button
				onclick={updateWelcomeGuests}
				class="btn preset-tonal-success aspect-square h-full rounded-full border p-0"
			>
				<TvMinimalPlay class="h-full" />
			</button>
		{/if}
		{#if welcomeGuests}
			<a
				href={youtubeUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn aspect-square h-full overflow-clip rounded-full border p-0"
			>
				<img class="h-full" src="/youtube.png" alt="" />
			</a>
		{/if}
	</div>
{/if}

{#if welcomeGuests}
	<div class="flex h-[90%] w-full flex-col items-center justify-around">
		<h1 class="text-size-7 text-pretty text-center font-bold">{welcomeString()}</h1>
		<div class="h-8/12 flex w-full justify-center">
			<!--iFrame of youtube video with 16/9 ratio-->
			<iframe
				class="rounded-4xl aspect-video h-full"
				src={youtubeEmbeddedUrl}
				title="YouTube video player"
				frameborder="0"
				allowfullscreen
			></iframe>
		</div>
	</div>
{:else if hasGuests === undefined}
	<div class="flex h-full w-full flex-col items-center justify-center">
		<h1 class="text-size-9 my-[2%] text-center font-black">Any Guests Today?</h1>
		<h2 class="text-size-4 my-[5%]">Look around the room and check!</h2>
	</div>
	<div class=" absolute bottom-2 flex h-1/6 w-full justify-around gap-4">
		<button
			class="btn text-size-6 preset-filled-success-500 aspect-square w-1/5 rounded-full border-2 p-[2%]"
			onclick={() => updateHasGuests(true)}>Yes</button
		>
		<button
			class="btn text-size-6 preset-filled-error-500 aspect-square w-1/5 rounded-full border-2 p-[2%]"
			onclick={() => updateHasGuests(false)}>No</button
		>
	</div>
{:else if !hasGuests}
	<div class="flex h-full w-full flex-col items-center justify-center">
		<h1 class="text-size-9 my-[2%] text-center font-black">No Guests Today!</h1>
		<h2 class="text-size-4 my-[5%]">There are now guests today.</h2>
	</div>
{:else if hasGuests}
	<div class="flex h-full w-full flex-col items-center justify-start">
		<h1 class="text-size-9 text-center font-black">Who are they?</h1>
		{#if guestDailies.length > 0}
			<div
				class="flex h-[80%] w-full flex-row flex-wrap items-center justify-center gap-[10%] overflow-y-auto pt-[1%] shadow"
			>
				{#each guestDailies as guest}
					<GuestButton
						{guest}
						{guestAvatarMap}
						buttonClass="px-[2%] h-2/5"
						nameClass="text-size-7"
						onClick={() => {}}
					/>
				{/each}
			</div>
		{:else}
			<div class="flex h-[70%] w-full items-center justify-center gap-[10%]">
				<button
					class="btn preset-filled-primary-500 text-size-6 flex justify-center rounded-full p-[2%]"
					onclick={() => (modalOpen = true)}
				>
					<UserRoundPlus />
					<span class="">Add a Guest</span>
				</button>
			</div>
		{/if}
	</div>
{/if}

<Modal
	open={modalOpen}
	onOpenChange={(e) => (modalOpen = e.open)}
	triggerBase="btn preset-filled-primary-500 rounded-full text-size-4"
	contentBase="card preset-filled-primary-50-950 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<header class="flex justify-between">
			<Combobox
				ids={{ root: 'guest-combobox' }}
				classes="shadow w-[45%] z-10"
				allowCustomValue={true}
				data={guestComboboxArray}
				value={selectedGuestName}
				onValueChange={reusePreviousGuest}
				onInputValueChange={updateModalGuestName}
				label=""
				placeholder="Guest Name"
			>
				<!-- This is optional. Combobox will render label by default -->
				{#snippet item(item)}
					<div class="flex w-full justify-between space-x-2">
						<span>{item.label}</span>
						<span>{item.emoji}</span>
					</div>
				{/snippet}
			</Combobox>

			<nav
				class="btn preset-outlined-surface-500 group relative w-[15%] gap-0 overflow-clip rounded-full outline-2 contain-strict"
			>
				<button
					type="button"
					onclick={() => (selectedPronoun = selectedPronoun === 'he' ? undefined : 'he')}
					class={`btn  -ml-[50%] w-1/2 border-r-2 py-[50%] pl-[50%] ${selectedPronoun == 'he' ? 'bg-blue-400 hover:bg-blue-600' : 'preset-tonal hover:bg-blue-500'}`}
					>He</button
				>
				<button
					type="button"
					onclick={() => (selectedPronoun = selectedPronoun === 'she' ? undefined : 'she')}
					class={`btn -mr-[50%] w-1/2 border-l-2 py-[50%] pr-[50%] ${selectedPronoun == 'she' ? 'bg-pink-400 hover:bg-pink-600' : 'preset-tonal hover:bg-pink-500'}`}
					>She</button
				>
			</nav>
			<Combobox
				ids={{ root: 'avatar-combobox' }}
				classes="shadow z-10 w-1/3 w-[35%] h-2/5"
				allowCustomValue={false}
				data={avatarComboboxArray}
				value={selectedAvatarId}
				onValueChange={updateAvatar}
				onFocusOutside={(e) => console.log('focus outside', e)}
				label=""
				placeholder="Avatar"
			>
				<!-- This is optional. Combobox will render label by default -->
				{#snippet item(item)}
					<div class="flex w-full justify-between space-x-2">
						<span class="w-5/6 truncate">{item.label}</span>
						<span>{item.emoji}</span>
					</div>
				{/snippet}
			</Combobox>
		</header>
		<article class="flex h-24 w-full items-center justify-center gap-[10%]">
			<SampleButton
				buttonClass="h-full"
				imageUrl={avatarURL(selectedAvatarId[0])}
				text={modalGuestName}
				imgAlt={modalGuestName}
				textClass="text-size-7 fontbold"
			/>
		</article>
		<footer class="flex justify-end gap-4">
			<button type="button" class="btn preset-tonal" onclick={() => resetModal()}>Cancel</button>
			<button type="button" class="btn preset-filled" onclick={() => addGuest()}>Confirm</button>
		</footer>
	{/snippet}
</Modal>
