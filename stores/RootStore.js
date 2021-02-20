/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { decorate, observable } from 'mobx';
import { ignore } from 'mobx-sync';

import MediaStore from './MediaStore';
import ServerStore from './ServerStore';
import SettingStore from './SettingStore';

export default class RootStore {
	/**
	 * Has the store been loaded from storage
	 */
	storeLoaded = false

	/**
	 * Is the fullscreen interface active
	 */
	isFullscreen = false

	/**
	 * Does the webview require a reload
	 */
	isReloadRequired = false

	/**
	 * Was the native player closed manually
	 */
	didPlayerCloseManually = true

	mediaStore = new MediaStore()
	serverStore = new ServerStore()
	settingStore = new SettingStore()

	reset() {
		this.isFullscreen = false;
		this.isReloadRequired = false;
		this.didPlayerCloseManually = true;

		this.mediaStore.reset();
		this.serverStore.reset();
		this.settingStore.reset();

		this.storeLoaded = true;
	}
}

decorate(RootStore, {
	storeLoaded: [ ignore, observable ],
	isFullscreen: [ ignore, observable ],
	isReloadRequired: [ ignore, observable ],
	didPlayerCloseManually: [ ignore, observable ]
});
