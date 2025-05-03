<script lang="ts">
	import type {
		GuestAvatar,
		GuestDaily,
		Student,
		StudentDaily,
		Teacher,
		TeacherDaily
	} from '$lib/pb/types';
	import { onMount } from 'svelte';
	import PersonButton from '$lib/PersonButton.svelte';
	import { getPronounPresent, getPronounSubject } from '$lib';
	import PersonBar from '$lib/slides/attendance/PersonBar.svelte';
	import type { ClassProps } from './_types';
	import { Combobox, Modal } from '@skeletonlabs/skeleton-svelte';
	import Trash from '@lucide/svelte/icons/trash-2';
	import { getGuestAvatarMap, getGuestDailes, getPbImageUrl } from '$lib/pb';

	interface GuestCheckProps {
		hasGuests?: boolean;
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
		hasGuests = $bindable(undefined), // TODO set default to undefined
		pageLeft = () => {},
		pageRight = () => {},
		updateClassDailyAttendance = async (partialClassDailyAttendance: Partial<ClassProps>) => {}
	}: GuestCheckProps = $props();

	const answerQuestion = (answer: boolean) => {
		hasGuests = hasGuests === answer ? undefined : answer;
		updateClassDailyAttendance({ hasGuests: hasGuests });
	};

	let todayGuests: GuestDaily[] = $state([]);
	let previousGuests: GuestDaily[] = $state([]);
	let guestComboboxArray: ComboboxData[] = $state([]);
	let guestAvatarMap: Map<string, GuestAvatar> = new Map();
	let avatarComboboxArray: ComboboxData[] = $state([]);
	onMount(async () => {
		guestAvatarMap = await getGuestAvatarMap();
		guestAvatarMap.values().forEach((avatar) => {
			avatarComboboxArray.push({
				label: avatar.name,
				value: avatar.id,
				emoji: avatar.emoji
			});
		});

		const date = new Date();
		const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
		const lastDate = month < 8 ? `${year - 1}-08-01` : `${year}-08-01`;

		todayGuests = await getGuestDailes();
		previousGuests = await getGuestDailes({ after: lastDate });
		previousGuests.forEach((guestDaily) => {
			let emoji = guestAvatarMap.get(guestDaily.avatar)?.emoji || '❔';
			guestComboboxArray.push({
				label: guestDaily.name,
				value: guestDaily.id,
				emoji: emoji
			});
		});
	});

	let selectedGuestName: string[] = $state([]);
	let selectedAvatarId: string[] = $state([]);
	let selectedPronoun: string | undefined = $state();

	let formName: string | undefined = $state();
	let formPronoun: string | undefined = $state();
	let formAvatar: string | undefined = $state();

	const reusePreviousGuest = (e: any) => {
		console.log('Selected Guest', e);
		let guest = previousGuests.find((guest) => guest.id === e.value[0]);
		console.log('Guest', guest);
		selectedPronoun = guest?.pronoun || '';
		selectedGuestName = [guest?.name || e.label];
		selectedAvatarId = [guest?.avatar ?? ""];
	};

	let openState = $state(false);

	const updateAvatar = (avatar: any) => {
		selectedAvatarId = avatar.value;
		console.log('Avatars', avatar.value);
	};

	const avatarURL = (avatarId: string) => {
		let avatar = guestAvatarMap.get(avatarId);
		if (!avatar) return '/default_guest_avatar.png';
		let url =  getPbImageUrl(avatar.collectionId, avatar.id, avatar.image);
		console.log('Avatar URL', url);
		return url;
	};

	function modalClose() {
		openState = false;
	}

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowLeft') {
			pageLeft();
		} else if (event.key === 'ArrowRight') {
			pageRight();
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

<div class=" absolute bottom-2 flex h-1/6 w-full justify-around gap-4">
	<button
		class="btn text-medium preset-filled-success-500 aspect-square w-1/5 rounded-full border-2 p-[2%]"
		onclick={() => answerQuestion(true)}>Yes</button
	>
	<button
		class="btn text-medium preset-filled-error-500 aspect-square w-1/5 rounded-full border-2 p-[2%]"
		onclick={() => answerQuestion(false)}>No</button
	>
</div>

{#if hasGuests === undefined}
	<div class="flex h-full w-full flex-col items-center justify-center">
		<h1 class="text-extralarge my-[2%] font-bold">Any Guests Today?</h1>
		<h2 class="text-small my-[5%]">Look around the room and check!</h2>
	</div>
{:else if !hasGuests}
	<div class="flex h-full w-full flex-col items-center justify-center">
		<h1 class="text-extralarge my-[2%] text-center font-bold">No Guests Today!</h1>
		<h2 class="text-small my-[5%]">There are now guests today.</h2>
	</div>
{:else}
	<div class="flex h-full w-full flex-col items-center justify-start bg-red-500">
		<h1 class="text-extralarge my-[2%] bg-blue-500 text-center font-bold">Who are they?</h1>
		<div class="flex h-[15%] w-full items-center justify-center gap-[10%] bg-green-500">
			<Modal
				open={openState}
				onOpenChange={(e) => (openState = e.open)}
				triggerBase="btn preset-filled-primary-500 rouned-full"
				contentBase="card bg-primary-100 p-4 space-y-4 shadow-xl max-w-screen-sm"
				backdropClasses="backdrop-blur-sm"
			>
				{#snippet trigger()}Add a Guest{/snippet}
				{#snippet content()}
					<header class="flex justify-between">
						<Combobox
							ids={{ root: 'guest-combobox' }}
							classes="h-2/5 bg-yellow-500 z-10"
							allowCustomValue={true}
							data={guestComboboxArray}
							value={selectedGuestName}
							onValueChange={reusePreviousGuest}
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
								class="btn preset-tonal hover:preset-tonal-primary -ml-[50%] w-1/2 border-r-2 py-[50%] pl-[50%]"
								>He</button
							>
							<button
								type="button"
								class="btn preset-tonal hover:preset-tonal-primary -mr-[50%] w-1/2 border-l-2 py-[50%] pr-[50%]"
								>She</button
							>
						</nav>
						<Combobox
							ids={{ root: 'avatar-combobox' }}
							classes="bg-yellow-500 z-10 w-1/3"
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
					<article
						class=" grid w-full grid-cols-4 items-center justify-center gap-[10%] bg-green-500"
					>
						<img class="" src={avatarURL(selectedAvatarId[0])} alt="" />
						<span class="col-span-2">
							{#if selectedGuestName}
								{selectedGuestName[0]}
							{/if}
						</span>
					</article>
					<footer class="flex justify-end gap-4">
						<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
						<button type="button" class="btn preset-filled" onclick={modalClose}>Confirm</button>
					</footer>
				{/snippet}
			</Modal>
		</div>

		<button class="btn hover:scale-105 active:scale-95">
			<Trash class="" />
		</button>
	</div>
{/if}
