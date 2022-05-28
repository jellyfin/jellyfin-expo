/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import compareVersions from 'compare-versions';
import { action, computed, decorate, observable } from 'mobx';
import { Platform } from 'react-native';

import Themes from '../themes';
/**
 * Data store for application settings
 */
export default class SettingStore {
	#DEFAULT_ROTATION_LOCK_ENABLED = Platform.OS === 'ios' && !Platform.isPad;

	#DEFAULT_SCREEN_LOCK_ENABLED = Platform.OS === 'ios' ? !!Platform.Version && compareVersions.compare(Platform.Version, '14', '<') : true;

	/**
	 * The id of the currently selected server
	 */
	activeServer = 0

	/**
	 * Is device rotation lock enabled
	 */
	isRotationLockEnabled = this.#DEFAULT_ROTATION_LOCK_ENABLED

	/**
	 * Is screen lock active when media is playing
	 */
	isScreenLockEnabled = this.#DEFAULT_SCREEN_LOCK_ENABLED

	/**
	 * Are tab labels enabled
	 */
	isTabLabelsEnabled = true

	/**
	 * The user selected theme value
	 */
	themeId = 'dark'

	/**
	 * The system level appearance/theme value
	 */
	systemThemeId

	/**
	 * Should the app use system level theme
	 */
	isSystemThemeEnabled = false

	/**
	 * Is the native video player enabled
	 */
	isNativeVideoPlayerEnabled = false

	/**
	 * Is fMP4 enabled for the native video player
	 */
	isFmp4Enabled = false;

	/**
	 * EXPERIMENTAL: Is the native audio player enabled
	 */
	isExperimentalNativeAudioPlayerEnabled = false

	/**
	 * EXPERIMENTAL: Is download support enabled
	 */
	isExperimentalDownloadsEnabled = false;

	get theme() {
		const id = this.isSystemThemeEnabled && this.systemThemeId && this.systemThemeId !== 'no-preference' ? this.systemThemeId : this.themeId;
		return Themes[id] || Themes.dark;
	}

	reset() {
		this.activeServer = 0;
		this.isRotationLockEnabled = this.#DEFAULT_ROTATION_LOCK_ENABLED;
		this.isScreenLockEnabled = this.#DEFAULT_SCREEN_LOCK_ENABLED;
		this.isTabLabelsEnabled = true;
		this.themeId = 'dark';
		this.systemThemeId = null;
		this.isSystemThemeEnabled = false;
		this.isNativeVideoPlayerEnabled = false;
		this.isFmp4Enabled = false;

		this.isExperimentalNativeAudioPlayerEnabled = false;
		this.isExperimentalDownloadsEnabled = false;
	}
}

decorate(SettingStore, {
	activeServer: observable,
	isRotationLockEnabled: observable,
	isScreenLockEnabled: observable,
	isTabLabelsEnabled: observable,
	themeId: observable,
	systemThemeId: observable,
	isSystemThemeEnabled: observable,
	isNativeVideoPlayerEnabled: observable,
	isFmp4Enabled: observable,
	isExperimentalNativeAudioPlayerEnabled: observable,
	isExperimentalDownloadsEnabled: observable,
	theme: computed,
	reset: action
});
