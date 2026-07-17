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
	experimental: {
		// SECURITY: Content-Security-Policy generated at build time. Astro manages
		// `script-src` and `style-src` as 'self' + auto-generated hashes for its own
		// inline island/critical-CSS blocks, so the policy stays strict (no
		// 'unsafe-inline' for scripts) without breaking hydration. Defense-in-depth
		// on top of the sandboxed e-mail iframe. `frame-ancestors` is a header-only
		// directive (ignored in <meta>), so it's set at the reverse-proxy layer.
		csp: {
			directives: [
				"default-src 'self'",
				"base-uri 'self'",
				"object-src 'none'",
				// E-mail inline images are data: URIs; external img/font/connect are
				// blocked, which also stops e-mail tracking pixels from loading.
				"img-src 'self' data:",
				"font-src 'self'",
				"connect-src 'self'",
				"frame-src 'self'",
				"form-action 'self'",
			],
		},
	},
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
