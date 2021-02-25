/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import RootStore from '../RootStore';
import ServerStore from '../ServerStore';
import SettingStore from '../SettingStore';

describe('RootStore', () => {
	it('should initialize with default values', () => {
		const store = new RootStore();

		expect(store.storeLoaded).toBe(false);
		expect(store.isFullscreen).toBe(false);
		expect(store.serverStore).toBeInstanceOf(ServerStore);
		expect(store.settingStore).toBeInstanceOf(SettingStore);
	});

	it('should reset to the default values', () => {
		const store = new RootStore();
		store.isFullscreen = true;

		store.serverStore.reset = jest.fn();
		store.settingStore.reset = jest.fn();

		expect(store.storeLoaded).toBe(false);
		expect(store.isFullscreen).toBe(true);
		expect(store.serverStore.reset.mock.calls).toHaveLength(0);
		expect(store.settingStore.reset.mock.calls).toHaveLength(0);

		store.reset();

		expect(store.storeLoaded).toBe(true);
		expect(store.isFullscreen).toBe(false);
		expect(store.serverStore.reset.mock.calls).toHaveLength(1);
		expect(store.settingStore.reset.mock.calls).toHaveLength(1);
	});
});
