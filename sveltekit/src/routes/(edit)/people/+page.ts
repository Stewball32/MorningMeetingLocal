import type { PageLoad } from './$types';
import { SchoolBuilder } from '$lib/pb';

const layout = {
	title: 'Manage People',
	subtitle: 'Edit Students and Teachers.'
};

export const load = (async () => {
	try {
		const [classrooms, people, ImageAssets] = await Promise.all([
			SchoolBuilder.getAllClassrooms(),
			SchoolBuilder.getAllPeople(),
			SchoolBuilder.getAllImageAssets()
		]);

		return { layout, classrooms, people, ImageAssets, loadError: '' };
	} catch (error) {
		console.error('Failed to load people/classrooms:', error);
		return {
			layout,
			classrooms: [],
			people: [],
			ImageAssets: [],
			loadError: 'Could not reach PocketBase. Is it running at PUBLIC_POCKETBASE_URL?'
		};
	}
}) satisfies PageLoad;
