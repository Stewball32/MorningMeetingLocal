<script lang="ts">
	import type { PageData } from './$types'
	import { Presentation, Slide, Code, Transition, Action } from '@animotion/core'
	import { tween } from '@animotion/motion'
	import Reveal from 'reveal.js'
	import Attendance from '$lib/slides/attendance/Attendance.svelte'
	import { pb } from '$lib/pb'
	import type { Student, Teacher } from '$lib/pb'
	import { onMount } from 'svelte'

	let { data }: { data: PageData } = $props()

	// From presentation.svelte.d.ts
	type Options = {
		reload?: boolean
	}
	const presentationOptions: Reveal.Options & Options = {
		history: true,
		transition: 'slide'
		// disableLayout: true,
		// controls: false,
		// progress: false,
		// embedded: true,
	}

	let text: HTMLParagraphElement
	let code: ReturnType<typeof Code>
	let circle = tween({ x: 0, y: 80, r: 80, fill: '#00ffff' })
	let items = $state([1, 2, 3, 4])
	let layout = $state('flex gap-4')

	let students: Student[] = $state([])
	let teachers: Teacher[] = $state([])

	onMount(async () => {
		try {
			const studentData = (await pb.collection('students').getFullList()) as Student[]
			console.log(studentData)
			students = studentData
			console.log(students)
		} catch (error) {
			console.error(error)
		}

		try {
			const teacherData = (await pb.collection('teachers').getFullList()) as Teacher[]
			teachers = teacherData
		} catch (error) {
			console.error(error)
		}
	})
	Reveal
	let bgColor = $derived("bg-[#3B82F6]")
</script>

<div class="absolute top-0 right-0 text-xs text-blue-600 z-10">
	<p class="block sm:hidden">XS</p>
	<p class="hidden sm:block md:hidden">SM</p>
	<p class="hidden md:block lg:hidden">MD</p>
	<p class="hidden lg:block xl:hidden">LG</p>
	<p class="hidden xl:block 2xl:hidden">XL</p>
	<p class="hidden 2xl:block">2XL</p>
</div>

<Presentation class={bgColor} options={presentationOptions}>
	<Attendance {students} {teachers} />

	<Slide animate class="h-full place-content-center place-items-center">
		<img src="/favicon.png" class="absolute m-0 aspect-[1821/1000] sm:m-2 md:m-8" alt="" />
		<Transition
			do={async () => {
				text.classList.replace('text-6xl', 'text-8xl')
				await code.update``
			}}
		>
			<p bind:this={text} class="text-8xl font-bold drop-shadow-sm">🪄 Animotion</p>
		</Transition>

		<Transition
			do={async () => {
				text.classList.replace('text-8xl', 'text-6xl')
				await code.update`
								async function animate() {
									// ...
								}
							`
				await circle.to({ x: 0, fill: '#00ffff' })
			}}
			class="mt-16"
		>
			<Code
				bind:this={code}
				lang="ts"
				theme="poimandres"
				code={``}
				options={{ duration: 600, stagger: 0.3, containerStyle: false }}
			/>
		</Transition>

		<Transition
			do={async () => {
				await code.update`
								async function animate() {
									// ...
								}
							`
				await circle.to({ x: 0, fill: '#00ffff' })
			}}
			class="mt-16"
		>
			<svg width="560" height={circle.r * 2} viewBox="-80 0 560 {circle.r * 2}">
				<circle cx={circle.x} cy={circle.y} r={circle.r} fill={circle.fill} />
				<text
					x={circle.x}
					y={circle.y}
					font-size={circle.r * 0.4}
					font-family="Monaspace Neon"
					text-anchor="middle"
					dominant-baseline="middle"
				>
					{circle.x.toFixed(0)}
				</text>
			</svg>
		</Transition>

		<Action
			do={async () => {
				await code.update`
								async function animate() {
									await circle.to({ x: 400, fill: '#ffff00' })
								}
							`
				await code.selectLines`2`
				await circle.to({ x: 400, fill: '#ffff00' })
			}}
		/>

		<Action
			do={async () => {
				await code.update`
								async function animate() {
									await circle.to({ x: 400, fill: '#ffff00' })
									await circle.to({ x: 0, fill: '#00ffff' })
								}
							`
				await code.selectLines`3`
				await circle.to({ x: 0, fill: '#00ffff' })
			}}
		/>

		<Action
			do={async () => {
				await code.selectLines`*`
				await code.update`
							async function animate() {
								await circle.to({ x: 400, fill: '#ffff00' })
								await circle.to({ x: 0, fill: '#00ffff' })
							}
						`
				await circle.to({ x: 0, fill: '#00ffff' })
			}}
		/>
	</Slide>

	<Slide class="h-full place-content-center place-items-center">
		<img
			data-id={Math.random().toString(36).substring(7)}
			src="/paper.svg"
			class="absolute m-0 aspect-[1821/1000] sm:m-2 md:m-8"
			alt=""
		/>
		<Transition>
			<p class="text-6xl font-bold drop-shadow-sm">🪄 Layout Animations</p>
		</Transition>

		<Transition
			do={() => {
				items = [1, 2, 3, 4]
				layout = 'flex gap-4'
			}}
			class="mt-16"
		>
			<div class={layout}>
				{#each items as item (item)}
					<Transition
						class="grid h-[180px] w-[180px] place-content-center rounded-2xl border-t-2 border-white bg-gray-200 text-6xl font-semibold text-black shadow-2xl"
						enter="rotate"
						visible
					>
						{item}
					</Transition>
				{/each}
			</div>
		</Transition>

		<Transition
			do={() => {
				layout = 'grid grid-cols-2 grid-rows-2 gap-4'
				items = [4, 3, 2, 1]
			}}
		/>
		<Transition
			do={() => {
				layout = 'grid grid-cols-2 grid-rows-2 gap-4'
				items = [2, 1, 4, 3]
			}}
		/>
		<Transition
			do={() => {
				layout = 'grid grid-cols-2 grid-rows-2 gap-4'
				items = [4, 3, 2, 1]
			}}
		/>
		<Transition
			do={() => {
				layout = 'grid grid-cols-2 grid-rows-2 gap-4'
				items = [1, 2, 3, 4]
			}}
		/>
		<Transition do={() => (layout = 'flex gap-4')} />
	</Slide>

	<Slide class="h-full place-content-center place-items-center">
		<p class="mt-8 text-6xl font-bold">🪄 Animotion</p>
		<p class="mt-16 text-3xl">
			Learn more by reading the
			<a class="underline" href="https://animotion.pages.dev/docs" target="_blank">
				Animotion docs
			</a>.
		</p>
	</Slide>
</Presentation>
