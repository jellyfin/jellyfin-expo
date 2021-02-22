/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Constants from 'expo-constants';
import { getAppName, getSafeDeviceName } from '../Device';

describe('Device', () => {
	describe('getAppName()', () => {
		it('should return the app name including the os name', () => {
			expect(getAppName()).toBe('Jellyfin Mobile (mock)');
		});
	});

	describe('getSafeDeviceName()', () => {
		it('should return safe device names unchanged', () => {
			expect(getSafeDeviceName()).toBe('Test Phone');
		});

		it('should change the iOS default apostrophe to an ascii single quote', () => {
			Constants.deviceName = 'thornbill’s iPhone';
			expect(getSafeDeviceName()).toBe('thornbill\'s iPhone');
		});

		it('should remove non-ascii characters and trim whitespace', () => {
			Constants.deviceName = '🌮😂 iPhone ';
			expect(getSafeDeviceName()).toBe('iPhone');
		});

		it('should return a default name if device name only contains non-ascii and whitespace characters', () => {
			Constants.deviceName = '  🌮😂 ';
			expect(getSafeDeviceName()).toBe('Jellyfin Mobile Device');
		});
	});
});
