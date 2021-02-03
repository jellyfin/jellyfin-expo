/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, computed, decorate, observable } from 'mobx';
import { Platform } from 'react-native';

import Themes from '../themes';

/**
 * Data store for application settings
 */
export default class SettingStore {
	/**
	 * The id of the currently selected server
	 */
	activeServer = 0

	/**
	 * Is device rotation lock enabled
	 */
	isRotationLockEnabled = Platform.OS === 'ios' && !Platform.isPad

	/**
	 * Is screen lock active when media is playing
	 */
	isScreenLockEnabled = Platform.OS === 'ios' ? (parseInt(Platform.Version, 10) < 14) : true

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

	get theme() {
		const id = this.isSystemThemeEnabled && this.systemThemeId ? this.systemThemeId : this.themeId;
		return Themes[id];
	}

	reset() {
		this.activeServer = 0;
		this.isRotationLockEnabled = Platform.OS === 'ios' && !Platform.isPad;
		this.isScreenLockEnabled = Platform.OS === 'ios' ? (parseInt(Platform.Version, 10) < 14) : true;
		this.isTabLabelsEnabled = true;
		this.themeId = 'dark';
		this.systemThemeId = null;
		this.isSystemThemeEnabled = false;
		this.isNativeVideoPlayerEnabled = false;
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
	theme: computed,
	reset: action
});
