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
			this.downloads = [ ...this.downloads, download ];
		}
	}

	remove(index) {
		this.downloads = [
			...this.downloads.slice(0, index),
			...this.downloads.slice(index + 1)
		];
	}

	update(original, changes = {}) {
		const index = this.downloads.findIndex(search => search.serverId === original.serverId && search.itemId === original.itemId);
		if (index > -1) {
			const updated = {
				...this.downloads[index],
				...changes
			};
			this.downloads[index] = updated;
		} else {
			console.warn('trying to update download missing from store', original);
		}
	}

	reset() {
		this.downloads = [];
	}
}

decorate(DownloadStore, {
	downloads: [ observable ],
	add: action,
	remove: action,
	update: action,
	reset: action
});
