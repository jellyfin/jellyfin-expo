/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { getIconName } from '../utils/Icons';

export default [
	{
		key: 'links-website',
		name: 'links.website',
		url: 'https://jellyfin.org/',
		icon: {
			name: getIconName('globe'),
			type: 'ionicon'
		}
	},
	{
		key: 'links-documentation',
		name: 'links.documentation',
		url: 'https://docs.jellyfin.org',
		icon: {
			name: getIconName('book'),
			type: 'ionicon'
		}
	},
	{
		key: 'links-source',
		name: 'links.source',
		url: 'https://github.com/jellyfin/jellyfin-expo',
		icon: {
			name: 'logo-github',
			type: 'ionicon'
		}
	},
	{
		key: 'links-translate',
		name: 'links.translate',
		url: 'https://translate.jellyfin.org/projects/jellyfin/jellyfin-expo/',
		icon: {
			name: 'translate',
			type: 'material'
		}
	},
	{
		key: 'links-feature',
		name: 'links.feature',
		url: 'https://features.jellyfin.org/',
		icon: {
			name: getIconName('create'),
			type: 'ionicon'
		}
	},
	{
		key: 'links-issue',
		name: 'links.issue',
		url: 'https://github.com/jellyfin/jellyfin-expo/issues',
		icon: {
			name: getIconName('bug'),
			type: 'ionicon'
		}
	}
];
