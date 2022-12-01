/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Jellyfin } from '@jellyfin/sdk';

import DownloadStore from '../DownloadStore';
import MediaStore from '../MediaStore';
import RootStore from '../RootStore';
import ServerStore from '../ServerStore';
import SettingStore from '../SettingStore';

describe('RootStore', () => {
	it('should initialize with default values', () => {
		const store = new RootStore();

		expect(store.storeLoaded).toBe(false);
		expect(store.isFullscreen).toBe(false);
		expect(store.isReloadRequired).toBe(false);
		expect(store.didPlayerCloseManually).toBe(true);

		expect(store.sdk).toBeInstanceOf(Jellyfin);
		expect(store.sdk.deviceInfo.id).toBe(store.deviceId);

		expect(store.downloadStore).toBeInstanceOf(DownloadStore);
		expect(store.mediaStore).toBeInstanceOf(MediaStore);
		expect(store.serverStore).toBeInstanceOf(ServerStore);
		expect(store.settingStore).toBeInstanceOf(SettingStore);
	});

	it('should reset to the default values', () => {
		const store = new RootStore();
		store.isFullscreen = true;
		store.isReloadRequired = true;
		store.didPlayerCloseManually = false;

		store.downloadStore.reset = jest.fn();
		store.mediaStore.reset = jest.fn();
		store.serverStore.reset = jest.fn();
		store.settingStore.reset = jest.fn();

		expect(store.storeLoaded).toBe(false);
		expect(store.isFullscreen).toBe(true);
		expect(store.isReloadRequired).toBe(true);
		expect(store.didPlayerCloseManually).toBe(false);
		expect(store.downloadStore.reset).not.toHaveBeenCalled();
		expect(store.mediaStore.reset).not.toHaveBeenCalled();
		expect(store.serverStore.reset).not.toHaveBeenCalled();
		expect(store.settingStore.reset).not.toHaveBeenCalled();

		store.reset();

		expect(store.storeLoaded).toBe(true);
		expect(store.isFullscreen).toBe(false);
		expect(store.isReloadRequired).toBe(false);
		expect(store.didPlayerCloseManually).toBe(true);
		expect(store.downloadStore.reset).toHaveBeenCalled();
		expect(store.mediaStore.reset).toHaveBeenCalled();
		expect(store.serverStore.reset).toHaveBeenCalled();
		expect(store.settingStore.reset).toHaveBeenCalled();
	});
});
