/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DownloadModel from '../models/DownloadModel';
import { create } from 'zustand';

export const DESERIALIZER = (data: unknown) => {
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
};

type State = {
	downloads: Map<String, DownloadModel>,
}

type Actions = {
	getNewDownloadCount: () => number,
	add: (v: DownloadModel) => void,
	reset: () => void
}

export type DownloadStore = State & Actions

const initialState: State = {
	downloads: new Map<String, DownloadModel>()
}

export const useDownloadStore = create<State & Actions>()((set, get) => ({
	...initialState,
	getNewDownloadCount: () => Array
		.from(get().downloads.values())
		.filter(d => d.isNew)
		.length,
	add: (download) => { 
		const downloads = get().downloads
		if (!downloads.has(download.key)) {
			set({downloads: new Map([...downloads, [download.key, download]])})
		}
	},
	reset: () => set({downloads: new Map()})
}))