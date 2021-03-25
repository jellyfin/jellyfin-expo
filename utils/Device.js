/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

import iOSProfile from './profiles/ios';
import iOS10Profile from './profiles/ios10';
import iOS12Profile from './profiles/ios12';

export function getAppName() {
	return `Jellyfin Mobile (${Device.osName})`;
}

export function getSafeDeviceName() {
	const safeName = Constants.deviceName
	// Replace non-ascii apostrophe with single quote (default on iOS)
		.replace(/’/g, '\'')
	// Remove all other non-ascii characters
		.replace(/[^\x20-\x7E]/g, '')
	// Trim whitespace
		.trim();
	if (safeName) {
		return safeName;
	}

	return Device.modelName || 'Jellyfin Mobile Device';
}

export function getDeviceProfile() {
	if (Platform.OS === 'ios') {
		if (parseInt(Platform.Version, 10) < 11) {
			return iOS10Profile;
		} else if (parseInt(Platform.Version, 10) < 13) {
			return iOS12Profile;
		} else {
			return iOSProfile;
		}
	}
	// TODO: Add Android support
	return {};
}

export function isCompact({ height = 500 } = {}) {
	return height < 480;
}

// Does the platform support system level themes: https://docs.expo.io/versions/latest/sdk/appearance/
export function isSystemThemeSupported() {
	return (Platform.OS === 'ios' && parseInt(Platform.Version, 10) > 12) ||
		(Platform.OS === 'android' && parseInt(Platform.Version, 10) > 9);
}
