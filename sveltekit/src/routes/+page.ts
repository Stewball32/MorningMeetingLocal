import type { PageLoad } from './$types';

const layout = {
	title: 'Morning Meeting',
	subtitle: 'Quick controls for your local classroom flow.'
};

export const load = (() => {
	const actions = [
		{ label: 'Start presentation', href: '/view/p', tone: 'preset-filled-primary-500' },
		{ label: 'Join as student', href: '/view/s', tone: 'preset-tonal' },
		{ label: 'Join as teacher', href: '/view/t', tone: 'preset-outlined-surface-200-800' }
	];

	const highlights = [
		{
			title: "Today's focus",
			body: 'Kick off with the presentation, then quick polls.'
		},
		{
			title: 'Prep checklist',
			body: 'Confirm devices, load slides, and check the timer.'
		},
		{
			title: 'Room status',
			body: 'Classroom A is ready; guest room pending.'
		}
	];

	const stats = [
		{ label: 'Classrooms', value: '3 active', detail: '1 guest room pending' },
		{ label: 'People', value: '28', detail: '24 students, 4 teachers' },
		{ label: 'Slides', value: '12 decks', detail: '3 marked for today' }
	];

	return {
		layout,
		actions,
		highlights,
		stats
	};
}) satisfies PageLoad;
