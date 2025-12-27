import type { PageLoad } from './$types';
import { SchoolBuilder } from '$lib/pb';

const layout = {
	title: 'Manage Emotions',
	subtitle: 'Create and edit emotions.'
};

export const load = (async () => {
	try {
		const [emotions, ImageAssets] = await Promise.all([
			SchoolBuilder.getAllEmotions(),
			SchoolBuilder.getAllImageAssets()
		]);

		return { layout, emotions, ImageAssets, loadError: '' };
	} catch (error) {
		console.error('Failed to load emotions:', error);
		return {
			layout,
			emotions: [],
			ImageAssets: [],
			loadError: 'Could not reach PocketBase. Is it running at PUBLIC_POCKETBASE_URL?'
		};
	}
}) satisfies PageLoad;
