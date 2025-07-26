import IconMenu from '@lucide/svelte/icons/menu';
import IconSchool from '@lucide/svelte/icons/school';
import IconPeople from '@lucide/svelte/icons/users';
import IconPresentation from '@lucide/svelte/icons/presentation';
import IconImage from '@lucide/svelte/icons/image';
import IconSettings from '@lucide/svelte/icons/settings';

interface NavTileProps {
	label: string;
	labelExpanded: string;
	href: string;
	icon: typeof IconMenu;
	bar?: boolean;
	rail?: boolean;
	railExpanded?: boolean;
}

// Unused for now, tile headers are static in +layout.svelte
// export let navHeaders: NavTileProps[] = [
// 	{ label: 'Home', labelExpanded: 'Home', icon: IconHome, href: '/', bar: true, rail: true }
// ];

export let navTiles: NavTileProps[] = [
	{
		label: 'Classrooms',
		labelExpanded: 'My Classrooms',
		href: '/classrooms',
		icon: IconSchool,
		bar: true,
		rail: true
	},
	{
		label: 'People',
		labelExpanded: 'My People',
		href: '/people',
		icon: IconPeople,
		railExpanded: true
	},
	{
		label: 'Presentations',
		labelExpanded: 'My Presentations',
		href: '/presentations',
		icon: IconPresentation,
		bar: true,
		rail: true
	},
	{
		label: 'Slides',
		labelExpanded: 'My Slides',
		href: '/slides',
		icon: IconImage,
		railExpanded: true
	}
];

export let navFooter: NavTileProps[] = [
	{
		label: 'Settings',
		labelExpanded: 'Settings',
		href: '/settings',
		icon: IconSettings,
		bar: true,
		rail: true
	}
];
