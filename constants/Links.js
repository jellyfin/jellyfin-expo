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