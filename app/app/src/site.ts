import { GITHUB_SHA, VERSION_TAG } from 'astro:env/client'

import type { Props as BaseProps } from '~/layouts/Base.astro'

export interface Site
{
	lang?: BaseProps['lang']
	title?: BaseProps['title']
	description?: BaseProps['description']
	version?: BaseProps['version']
	author?: BaseProps['author']
	keywords?: BaseProps['keywords']
	generator?: BaseProps['generator']
	themeColor?: BaseProps['themeColor']
	viewportScale?: BaseProps['viewportScale']
	favicon?: BaseProps['favicon']
	socialTitle?: BaseProps['socialTitle']
	socialDescription?: BaseProps['socialDescription']
	socialImage?: BaseProps['socialImage']
	socialUrl?: BaseProps['socialUrl']
	socialType?: BaseProps['socialType']
	socialTwitterCard?: BaseProps['socialTwitterCard']
}

export const site: Site = {
	lang: 'en',
	title: 'o2o eml reader',
	description: {
		'en': 'Read and display the content of an EML e-mail file — an o2o internal tool. All processing happens locally in your browser.',
		'fr': 'Lire et afficher le contenu d\'un fichier e-mail EML — un outil interne o2o. Tout le traitement se fait localement dans votre navigateur.',
	},
	version: GITHUB_SHA || VERSION_TAG || 'dev',
	author: 'o2o',
	themeColor: '#0029D6',
	viewportScale: 1,
	favicon: '/favicon.svg',
	socialTitle: true,
	socialDescription: true,
}
