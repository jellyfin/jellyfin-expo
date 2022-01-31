/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { action, autorun, computed, decorate, observable } from 'mobx';
import { format } from 'mobx-sync-lite';

import DownloadModel from '../models/DownloadModel';

export default class DownloadStore {
	downloads = new Map<string, DownloadModel>();

	constructor() {
		autorun(() => {
			console.debug('[DEBUG] DownloadStore', this.downloads);
		});
	}

	get newDownloadCount() {
		return Array.from(this.downloads.values())
			.filter(d => d.isNew)
			.length;
	}

	add(download: DownloadModel) {
		// Do not allow duplicate downloads
		if (!this.downloads.has(download.key)) {
			this.downloads.set(download.key, download);
		}
	}

	reset() {
		this.downloads = new Map();
	}
}

decorate(DownloadStore, {
	downloads: [
		format(
			data => {
				const deserialized = new Map<string, DownloadModel>();
				Object.entries(data).forEach(([ key, dl ]) => {
					const model = new DownloadModel(
						dl.itemId,
						dl.serverId,
						dl.serverUrl,
						dl.apiKey,
						dl.title,
						dl.filename,
						dl.downloadUrl
					);
					model.isComplete = dl.isComplete;
					// isDownloading is ignored
					model.isNew = dl.isNew;
					deserialized.set(key, model);
				});
				return deserialized;
			}
		),
		observable
	],
	newDownloadCount: computed,
	add: action,
	reset: action
});
