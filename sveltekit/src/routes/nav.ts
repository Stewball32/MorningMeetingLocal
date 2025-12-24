import {
	type Icon,
	SchoolIcon,
	UsersIcon,
	PresentationIcon,
	LayersIcon,
	LaughIcon,
	ImageIcon,
	Calendar
} from '@lucide/svelte';

interface NavTileProps {
	label: string;
	labelExpanded: string;
	href: string;
	icon: typeof Icon;
	bar?: boolean;
	rail?: boolean;
	railExpanded?: boolean;
}

export let navTiles: NavTileProps[] = [
	{
		label: 'Classrooms',
		labelExpanded: 'My Classrooms',
		href: '/classrooms',
		icon: SchoolIcon,
		bar: true,
		rail: true
	},
	{
		label: 'People',
		labelExpanded: 'My People',
		href: '/people',
		icon: UsersIcon,
		railExpanded: true
	},
	{
		label: 'Presentations',
		labelExpanded: 'My Presentations',
		href: '/presentations',
		icon: PresentationIcon,
		bar: true,
		rail: true
	},
	{
		label: 'Slides',
		labelExpanded: 'My Slides',
		href: '/slides',
		icon: LayersIcon,
		railExpanded: true
	},
	{
		label: 'Images',
		labelExpanded: 'My Images',
		href: '/images',
		icon: ImageIcon,
		railExpanded: true
	},
	{
		label: 'Emotions',
		labelExpanded: 'My Emotions',
		href: '/emotions',
		icon: LaughIcon,
		railExpanded: true
	},
	{
		label: 'Calendar',
		labelExpanded: 'My Calendar',
		href: '/calendar',
		icon: Calendar,
		railExpanded: true
	}
];

export let navFooter: NavTileProps[] = [
	// {
	// 	label: 'Settings',
	// 	labelExpanded: 'Settings',
	// 	href: '/settings',
	// 	icon: IconSettings,
	// 	bar: true,
	// 	rail: true
	// }
];
