import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter() },
    vite: {
      preview: {
		host: '0.0.0.0',
        allowedHosts: ['meet.lan']
      }
    }
};

export default config;
