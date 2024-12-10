/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import compareVersions from 'compare-versions';
import { Platform } from 'react-native';

import Themes from '../themes';
import { create } from 'zustand';

type State = {
	/** The id of the currently selected server */
	activeServer: number,

	/** Is device rotation lock enabled */
	isRotationLockEnabled: boolean,

	/** Is screen lock active when media is playing */
	isScreenLockEnabled: boolean,

	/** Are tab labels enabled */
	isTabLabelsEnabled: boolean,

	/** The user selected theme value */
	themeId: string,

	/** The system level appearance/theme value */
	systemThemeId?: string,

	/** Should the app use system level theme */
	isSystemThemeEnabled: boolean,

	/** Is the native video player enabled */
	isNativeVideoPlayerEnabled: boolean,

	/** Is fMP4 enabled for the native video player */
	isFmp4Enabled: boolean,

	/** EXPERIMENTAL: Is the native audio player enabled */
	isExperimentalNativeAudioPlayerEnabled: boolean,

	/** EXPERIMENTAL: Is download support enabled */
	isExperimentalDownloadsEnabled: boolean
}

type Actions = {
	getTheme: () => any, // TODO: get typing on themes and put it here
	reset: () => void
}

export type SettingStore = State & Actions

const initialState: State = {
	activeServer: 0,
	isRotationLockEnabled: Platform.OS === 'ios' && !Platform.isPad,
	isScreenLockEnabled: Platform.OS === 'ios' 
		? !!Platform.Version && compareVersions.compare(Platform.Version, '14', '<') 
		: true,
	isTabLabelsEnabled: true,
	themeId: 'dark',
	isSystemThemeEnabled: false,
	isNativeVideoPlayerEnabled: false,
	isFmp4Enabled: true,
	isExperimentalNativeAudioPlayerEnabled: false,
	isExperimentalDownloadsEnabled: false,
	systemThemeId: null,
}

export const useSettingStore = create<SettingStore>()((set, get) => ({
	...initialState,
	getTheme: () => {
		const state = get()
		const id = state.isSystemThemeEnabled 
			&& state.systemThemeId 
			&& state.systemThemeId !== 'no-preference' 
				? state.systemThemeId 
				: state.themeId;
		//@ts-ignore TODO: This is because Themes doesn't have type hints.
		return Themes[id] || Themes.dark;
	},
	reset: () => null
}))