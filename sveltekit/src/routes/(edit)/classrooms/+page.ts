import type { PageLoad } from './$types';
import { SchoolBuilder } from '$lib/pb';

const layout = {
	title: 'Manage Classrooms',
	subtitle: 'Create, edit, or hide classrooms.'
};

export const load = (async () => {
	try {
		const [classrooms, people, imageAssets] = await Promise.all([
			SchoolBuilder.getAllClassrooms(),
			SchoolBuilder.getAllPeople(),
			SchoolBuilder.getAllImageAssets()
		]);
		return { layout, classrooms, people, imageAssets, loadError: '' };
	} catch (error) {
		console.error('Failed to load classrooms:', error);
		return {
			layout,
			classrooms: [],
			people: [],
			ImageAssets: [],
			loadError: error
		};
	}
}) satisfies PageLoad;
