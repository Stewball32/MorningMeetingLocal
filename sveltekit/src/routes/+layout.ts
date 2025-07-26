import type { LayoutLoad } from './$types';

export const ssr = false;

const noMenuPaths = [
	'/view/p', // presentation
	'/view/s/', // student view
	'/view/t/' // teacher view
];

export const load = (async ({ data, url }) => {
	const showMenu = !noMenuPaths.some((path) => url.pathname.startsWith(path));
	const pathname = url.pathname;
	return {
		showMenu,
		noMenuPaths,
		pathname
	};
}) satisfies LayoutLoad;
