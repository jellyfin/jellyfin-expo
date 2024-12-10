/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Jellyfin } from '@jellyfin/sdk';

import DownloadStore from '../DownloadStore';
import MediaStore from '../MediaStore';
import RootStore, { useRootStore } from '../RootStore';
import ServerStore from '../ServerStore';
import SettingStore from '../SettingStore';

import { renderHook, act } from '@testing-library/react'

describe('RootStore', () => {
	it('should initialize with default values', () => {
		const store = renderHook(() => useRootStore((state) => state)).result.current;

		expect(store.storeLoaded).toBe(false);
		expect(store.isFullscreen).toBe(false);
		expect(store.isReloadRequired).toBe(false);
		expect(store.didPlayerCloseManually).toBe(true);

		expect(store.getApi()).toBeInstanceOf(Jellyfin);
		expect(store.getApi().deviceInfo.id).toBe(store.deviceId);

		expect(store.downloadStore).toBeInstanceOf(DownloadStore);
		expect(store.mediaStore).toBeInstanceOf(MediaStore);
		expect(store.serverStore).toBeInstanceOf(ServerStore);
		expect(store.settingStore).toBeInstanceOf(SettingStore);
	});

	it('should reset to the default values', () => {
		const storeHook = renderHook(() => useRootStore((state) => state))

		store = storeHook.result.current

		act(() => {
			storeHook.result.current.isFullscreen = true;
			storeHook.result.current.isReloadRequired = true;
			storeHook.result.current.didPlayerCloseManually = false;
		})

		store.downloadStore.reset = jest.fn();
		store.mediaStore.reset = jest.fn();
		store.serverStore.reset = jest.fn();
		store.settingStore.reset = jest.fn();

		expect(storeHook.result.current.storeLoaded).toBe(false);
		expect(storeHook.result.current.isFullscreen).toBe(true);
		expect(storeHook.result.current.isReloadRequired).toBe(true);
		expect(storeHook.result.current.didPlayerCloseManually).toBe(false);
		expect(storeHook.result.current.downloadStore.reset).not.toHaveBeenCalled();
		expect(storeHook.result.current.mediaStore.reset).not.toHaveBeenCalled();
		expect(storeHook.result.current.serverStore.reset).not.toHaveBeenCalled();
		expect(storeHook.result.current.settingStore.reset).not.toHaveBeenCalled();

		act(() => {
			store.reset();
		})

		expect(storeHook.result.current.storeLoaded).toBe(true);
		expect(storeHook.result.current.isFullscreen).toBe(false);
		expect(storeHook.result.current.isReloadRequired).toBe(false);
		expect(storeHook.result.current.didPlayerCloseManually).toBe(true);
		expect(storeHook.result.current.downloadStore.reset).toHaveBeenCalled();
		expect(storeHook.result.current.mediaStore.reset).toHaveBeenCalled();
		expect(storeHook.result.current.serverStore.reset).toHaveBeenCalled();
		expect(storeHook.result.current.settingStore.reset).toHaveBeenCalled();
	});
});
