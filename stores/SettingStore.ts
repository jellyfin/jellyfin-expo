/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import compareVersions from 'compare-versions';

// TODO: Fix this import, this is a bandaid; issue #365
// eslint-disable-next-line import/namespace
import { Platform } from 'react-native';

import { create } from 'zustand';

import { createJSONStorage, persist } from 'zustand/middleware';

import Themes from '../themes';

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
	set: (v: Partial<State>) => void,
	getTheme: () => any, // TODO: get typing on themes and put it here
	reset: () => void
}

export type SettingStore = State & Actions

// This initial state must be a method because it has computed values that *might* change over time (tests & functionality broke without this)
const initialState: () => State = () => ({
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
	systemThemeId: null
});

const persistKeys = Object.keys(initialState());

export const useSettingStore = create<SettingStore>()(
	persist(
		(_set, _get) => ({
			...initialState(),
			set: (state) => { _set({ ...state }); },
			getTheme: () => {
				const state = _get();
				const id = state.isSystemThemeEnabled
					&& state.systemThemeId
					&& state.systemThemeId !== 'no-preference'
					? state.systemThemeId
					: state.themeId;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore TODO: This is because Themes doesn't have type hints.
				return Themes[id] || Themes.dark;
			},
			reset: () => {
				_set({ ...initialState() });
			}
		}), {
			name: 'SettingStore',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => Object.fromEntries(
				Object.entries(state).filter(([ key ]) => persistKeys.includes(key))
			)
		}
	)
);
