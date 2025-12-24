import type { PageLoad } from './$types';
import { SchoolBuilder } from '$lib/pb';

const layout = {
	title: 'Manage Images',
	subtitle: 'Create, edit, and tag image assets.'
};

export const load = (async () => {
	try {
		const imageAssets = await SchoolBuilder.getAllImageAssets();
		return { layout, imageAssets, loadError: '' };
	} catch (error) {
		console.error('Failed to load image assets:', error);
		return {
			layout,
			imageAssets: [],
			loadError: 'Could not reach PocketBase. Is it running at PUBLIC_POCKETBASE_URL?'
		};
	}
}) satisfies PageLoad;
