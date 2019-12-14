/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Platform } from 'react-native';

export default [
  {
    name: 'Jellyfin Website',
    url: 'https://jellyfin.media/',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-globe' : 'md-globe',
      type: 'ionicon'
    }
  },
  {
    name: 'Documentation',
    url: 'https://jellyfin.org/docs',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-book' : 'md-book',
      type: 'ionicon'
    }
  },
  {
    name: 'Source Code',
    url: 'https://github.com/jellyfin/jellyfin-expo',
    icon: {
      name: 'logo-github',
      type: 'ionicon'
    }
  },
  {
    name: 'Request a Feature',
    url: 'https://features.jellyfin.org/',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-create' : 'md-create',
      type: 'ionicon'
    }
  },
  {
    name: 'Report an Issue',
    url: 'https://github.com/jellyfin/jellyfin-expo/issues',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-bug' : 'md-bug',
      type: 'ionicon'
    }
  }
];