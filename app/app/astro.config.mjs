import { defineConfig, envField } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

import { i18n } from '/src/config'

// https://astro.build/config
export default defineConfig({
	site: process.env.ASTRO_SITE_URL || undefined,
	base: process.env.ASTRO_BASE_PATH || undefined,
	build: {
		assetsPrefix: process.env.ASTRO_ASSETS_PREFIX || undefined,
	},
	integrations: [
		svelte(),
	],
	vite: {
		plugins: [
			tailwindcss(),
		],
		optimizeDeps: {
			esbuildOptions: {
				// Node.js global to browser globalThis
				define: {
					global: 'globalThis',
				},
				// Enable esbuild polyfill plugins
				plugins: [
					NodeGlobalsPolyfillPlugin({
						buffer: true,
					}),
				],
			},
		},
	},
	i18n: i18n,
	// SECURITY: the Content-Security-Policy is set as a <meta> tag in Base.astro
	// (not Astro's built-in csp). Astro's generator always hashes its own inline
	// `astro-island` style, and a hash in style-src makes 'unsafe-inline' be
	// ignored — which blocked rendered e-mail bodies from keeping their inline
	// styles. Because the app and the e-mail iframe share one inherited policy,
	// allowing e-mail styling means the app-level style-src/script-src use
	// 'unsafe-inline'. Untrusted e-mail content stays contained by the iframe
	// sandbox (no scripts run there regardless). `frame-ancestors` is a
	// header-only directive, set at the reverse-proxy (Traefik) layer.
	env: {
		schema: {
			// Deployment configuration
			GITHUB_REPOSITORY_URL: envField.string({ context: 'client', access: 'public', optional: true }),
			GITHUB_SHA: envField.string({ context: 'client', access: 'public', optional: true }),
			VERSION_TAG: envField.string({ context: 'client', access: 'public', optional: true }),
			// Application configuration
			// Add env vars for your application here.
		},
		validateSecrets: true,
	},
})
