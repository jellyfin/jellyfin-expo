/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import 'react-native-get-random-values';

import { Jellyfin } from '@jellyfin/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { v4 as uuidv4 } from 'uuid';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getAppName, getSafeDeviceName } from '../utils/Device';

type State = {
	deviceId: string,
	storeLoaded: boolean,
	isFullscreen: boolean,
	isReloadRequired: boolean,
	didPlayerCloseManually: boolean,
}

type Actions = {
	set: (v: Partial<State>) => void,
	getApi: () => Jellyfin,
	reset: () => void,
}

export type RootStore = State & Actions

const initialState: State = {
	/** Generate a random unique device id */
	deviceId: uuidv4(),

	/** Has the store been loaded from storage */
	storeLoaded: false,

	/** Is the fullscreen interface active */
	isFullscreen: false,

	/** Does the webview require a reload */
	isReloadRequired: false,

	/** Was the native player closed manually */
	didPlayerCloseManually: true
};

const persistKeys = Object.keys(initialState);

export const useRootStore = create<State & Actions>()(
	persist(
		(_set, _get) => ({
			...initialState,
			set: (state) => { _set({ ...state }); },
			getApi: () => new Jellyfin({
				clientInfo: {
					name: getAppName(),
					version: Constants.nativeAppVersion
				},
				deviceInfo: {
					name: getSafeDeviceName(),
					id: _get().deviceId
				}
			}),
			reset: () => { // TODO: Confirm instances of this reset call reset all the other states as well
				_set({
					deviceId: uuidv4(),
					isFullscreen: false,
					isReloadRequired: false,
					didPlayerCloseManually: true,
					storeLoaded: true
				});
			}
		}), {
			name: 'RootStore',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => Object.fromEntries(
				Object.entries(state).filter(([ key ]) => persistKeys.includes(key))
			)
		}
	)
);
