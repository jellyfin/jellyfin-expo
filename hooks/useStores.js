/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useDownloadStore } from '../stores/DownloadStore';
import { useMediaStore } from '../stores/MediaStore';
import { useRootStore } from '../stores/RootStore';
import { useServerStore } from '../stores/ServerStore';
import { useSettingStore } from '../stores/SettingStore';

// Compatibility for zustand conversion
export const useStores = () => ({
	rootStore: useRootStore(),
	downloadStore: useDownloadStore(),
	serverStore: useServerStore(),
	mediaStore: useMediaStore(),
	settingStore: useSettingStore()
});
