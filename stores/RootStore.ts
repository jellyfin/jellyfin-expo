/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'react-native-get-random-values';

import { Jellyfin } from '@jellyfin/sdk';
import Constants from 'expo-constants';
import { v4 as uuidv4 } from 'uuid';

import { getAppName, getSafeDeviceName } from '../utils/Device';

import MediaStore from './MediaStore';
import ServerStore from './ServerStore';
import SettingStore from './SettingStore';
import { create } from 'zustand';

type State = {
	deviceId: string,
	storeLoaded: boolean,
	isFullscreen: boolean,
	isReloadRequired: boolean,
	didPlayerCloseManually: boolean,
	mediaStore: MediaStore,
	serverStore: ServerStore,
	settingStore: SettingStore,
}

type Actions = {
	getApi: () => Jellyfin,
	reset: () => void,
}

export type RootStore = State & Actions

const initialState: State = {
	deviceId: uuidv4(),
	storeLoaded: false,
	isFullscreen: false,
	isReloadRequired: false,
	didPlayerCloseManually: true,
	mediaStore: new MediaStore(),
	serverStore: new ServerStore(),
	settingStore: new SettingStore()
}

export const useRootStore = create<State & Actions>()((set, get) => ({
	...initialState,
	getApi: () => new Jellyfin({
		clientInfo: {
			name: getAppName(),
			version: Constants.nativeAppVersion
		},
		deviceInfo: {
			name: getSafeDeviceName(),
			id: get().deviceId
		}
	}),
	reset: () => {
		get().mediaStore.reset()
		get().serverStore.reset()
		get().settingStore.reset()

		set({
			deviceId: uuidv4(),
			isFullscreen: false,
			isReloadRequired: false,
			didPlayerCloseManually: true,
			storeLoaded: true,
		})
	},
}))