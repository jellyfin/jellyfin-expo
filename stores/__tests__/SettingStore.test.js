/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Platform } from 'react-native';

import Themes from '../../themes';
import SettingStore from '../SettingStore';

jest.mock('react-native/Libraries/Utilities/Platform');

describe('SettingStore', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	it('should initialize with default values', () => {
		const store = new SettingStore();

		expect(store.activeServer).toBe(0);
		expect(store.isRotationLockEnabled).toBe(true);
		expect(store.isScreenLockEnabled).toBe(false);
		expect(store.isTabLabelsEnabled).toBe(true);
		expect(store.themeId).toBe('dark');
		expect(store.systemThemeId).toBeUndefined();
		expect(store.isSystemThemeEnabled).toBe(false);
		expect(store.theme).toBe(Themes.dark);
		expect(store.isNativeVideoPlayerEnabled).toBe(false);
		expect(store.isFmp4Enabled).toBe(false);
		expect(store.isExperimentalDownloadsEnabled).toBe(false);
	});

	it('should disable rotation lock for iPad devices', () => {
		Platform.isPad = true;
		const store = new SettingStore();

		expect(store.isRotationLockEnabled).toBe(false);
	});

	it('should enable screen lock on older iOS versions', () => {
		Platform.Version = '13';
		const store = new SettingStore();

		expect(store.isScreenLockEnabled).toBe(true);
	});

	it('should enable screen lock on non-iOS platforms', () => {
		Platform.OS = 'android';
		const store = new SettingStore();

		expect(store.isScreenLockEnabled).toBe(true);
	});

	it('should use the system theme when enabled', () => {
		const store = new SettingStore();

		store.isSystemThemeEnabled = true;
		expect(store.theme).toBe(Themes.dark);

		store.systemThemeId = 'light';
		expect(store.theme).toBe(Themes.light);
	});

	it('should use the app theme if system theme is "no-preference"', () => {
		const store = new SettingStore();

		store.isSystemThemeEnabled = true;
		store.systemThemeId = 'no-preference';
		store.themeId = 'light';
		expect(store.theme).toBe(Themes.light);
	});

	it('should return the default theme if an invalid theme id is specified', () => {
		const store = new SettingStore();

		store.themeId = 'invalid';
		expect(store.theme).toBe(Themes.dark);
	});

	it('should reset to the default values', () => {
		const store = new SettingStore();
		store.activeServer = 99;
		store.isRotationLockEnabled = false;
		store.isScreenLockEnabled = true;
		store.isTabLabelsEnabled = false;
		store.themeId = 'light';
		store.systemThemeId = 'dark';
		store.isSystemThemeEnabled = true;
		store.isNativeVideoPlayerEnabled = true;
		store.isFmp4Enabled = true;
		store.isExperimentalDownloadsEnabled = true;

		expect(store.activeServer).toBe(99);
		expect(store.isRotationLockEnabled).toBe(false);
		expect(store.isScreenLockEnabled).toBe(true);
		expect(store.isTabLabelsEnabled).toBe(false);
		expect(store.themeId).toBe('light');
		expect(store.systemThemeId).toBe('dark');
		expect(store.isSystemThemeEnabled).toBe(true);
		expect(store.theme).toBe(Themes.dark);
		expect(store.isNativeVideoPlayerEnabled).toBe(true);
		expect(store.isFmp4Enabled).toBe(true);
		expect(store.isExperimentalDownloadsEnabled).toBe(true);

		store.reset();

		expect(store.activeServer).toBe(0);
		expect(store.isRotationLockEnabled).toBe(true);
		expect(store.isScreenLockEnabled).toBe(false);
		expect(store.isTabLabelsEnabled).toBe(true);
		expect(store.themeId).toBe('dark');
		expect(store.systemThemeId).toBeNull();
		expect(store.isSystemThemeEnabled).toBe(false);
		expect(store.theme).toBe(Themes.dark);
		expect(store.isNativeVideoPlayerEnabled).toBe(false);
		expect(store.isFmp4Enabled).toBe(false);
		expect(store.isExperimentalDownloadsEnabled).toBe(false);
	});
});
