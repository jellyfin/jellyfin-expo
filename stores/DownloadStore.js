/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { action, decorate, observable } from 'mobx';

export default class DownloadStore {
	downloads = []

	add(download) {
		// Do not allow duplicate downloads
		if (!this.downloads.find(search => search.serverId === download.serverId && search.itemId === download.itemId)) {
			this.downloads.push(download);
		}
	}

	remove(index) {
		this.downloads.splice(index, 1);
	}

	reset() {
		this.downloads = [];
	}
}

decorate(DownloadStore, {
	downloads: [ observable ],
	add: action,
	remove: action,
	reset: action
});
