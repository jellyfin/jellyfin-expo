/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// polyfill crypto.getRandomValues
import 'react-native-get-random-values';

import { Jellyfin } from '@jellyfin/sdk';
import Constants from 'expo-constants';
import { action, computed, decorate, observable } from 'mobx';
import { ignore } from 'mobx-sync-lite';
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
	// setFullscreen: (v: State['isFullscreen']) => void,
	// setReloadRequired: (v: State['isReloadRequired']) => void,
	// setDidPlayerCloseManually: (v: State['didPlayerCloseManually']) => void
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
	// setFullscreen: (isFullscreen) => set({ isFullscreen }),
	// setReloadRequired: (isReloadRequired) => set({isReloadRequired}),
	// setDidPlayerCloseManually: (didPlayerCloseManually) => set({ didPlayerCloseManually })
}))

// export default class RootStore {
// 	/**
// 	 * Generate a random unique device id
// 	 */
// 	deviceId = uuidv4()

// 	/**
// 	 * Has the store been loaded from storage
// 	 */
// 	storeLoaded = false

// 	/**
// 	 * Is the fullscreen interface active
// 	 */
// 	isFullscreen = false

// 	/**
// 	 * Does the webview require a reload
// 	 */
// 	isReloadRequired = false

// 	/**
// 	 * Was the native player closed manually
// 	 */
// 	didPlayerCloseManually = true

// 	downloadStore = new DownloadStore()
// 	mediaStore = new MediaStore()
// 	serverStore = new ServerStore()
// 	settingStore = new SettingStore()

// 	get sdk() {
// 		return new Jellyfin({
// 			clientInfo: {
// 				name: getAppName(),
// 				version: Constants.nativeAppVersion
// 			},
// 			deviceInfo: {
// 				name: getSafeDeviceName(),
// 				id: this.deviceId
// 			}
// 		});
// 	}

// 	reset() {
// 		this.deviceId = uuidv4();

// 		this.isFullscreen = false;
// 		this.isReloadRequired = false;
// 		this.didPlayerCloseManually = true;

// 		this.downloadStore.reset();
// 		this.mediaStore.reset();
// 		this.serverStore.reset();
// 		this.settingStore.reset();

// 		this.storeLoaded = true;
// 	}
// }

// decorate(RootStore, {
// 	deviceId: observable,
// 	storeLoaded: [ ignore, observable ],
// 	isFullscreen: [ ignore, observable ],
// 	isReloadRequired: [ ignore, observable ],
// 	didPlayerCloseManually: [ ignore, observable ],
// 	sdk: computed,
// 	reset: action
// });
