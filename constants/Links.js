/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Platform } from 'react-native';

export default [
  {
    key: 'links-website',
    name: 'Jellyfin Website',
    url: 'https://jellyfin.org/',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-globe' : 'md-globe',
      type: 'ionicon'
    }
  },
  {
    key: 'links-documentation',
    name: 'Documentation',
    url: 'https://docs.jellyfin.org',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-book' : 'md-book',
      type: 'ionicon'
    }
  },
  {
    key: 'links-source',
    name: 'Source Code',
    url: 'https://github.com/jellyfin/jellyfin-expo',
    icon: {
      name: 'logo-github',
      type: 'ionicon'
    }
  },
  {
    key: 'links-feature',
    name: 'Request a Feature',
    url: 'https://features.jellyfin.org/',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-create' : 'md-create',
      type: 'ionicon'
    }
  },
  {
    key: 'links-issue',
    name: 'Report an Issue',
    url: 'https://github.com/jellyfin/jellyfin-expo/issues',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-bug' : 'md-bug',
      type: 'ionicon'
    }
  }
];
