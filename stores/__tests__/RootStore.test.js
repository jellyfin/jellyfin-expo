/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */
import { Jellyfin } from '@jellyfin/sdk';

import { renderHook, act } from '@testing-library/react';

import { useRootStore } from '../RootStore';

describe('RootStore', () => {
	it('should initialize with default values', () => {
		const store = renderHook(() => useRootStore((state) => state)).result.current;

		expect(store.isFullscreen).toBe(false);
		expect(store.isReloadRequired).toBe(false);
		expect(store.didPlayerCloseManually).toBe(true);

		expect(store.getSdk()).toBeInstanceOf(Jellyfin);
		expect(store.getSdk().deviceInfo.id).toBe(store.deviceId);
	});

	it('should reset to the default values', () => {
		const storeHook = renderHook(() => useRootStore((state) => state));

		act(() => {
			storeHook.result.current.set({
				isFullscreen: true,
				isReloadRequired: true,
				didPlayerCloseManually: false
			});
		});

		expect(storeHook.result.current.isFullscreen).toBe(true);
		expect(storeHook.result.current.isReloadRequired).toBe(true);
		expect(storeHook.result.current.didPlayerCloseManually).toBe(false);

		act(() => {
			storeHook.result.current.reset();
		});

		expect(storeHook.result.current.isFullscreen).toBe(false);
		expect(storeHook.result.current.isReloadRequired).toBe(false);
		expect(storeHook.result.current.didPlayerCloseManually).toBe(true);
	});
});
