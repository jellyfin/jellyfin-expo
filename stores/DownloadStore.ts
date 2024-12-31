/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { create } from 'zustand';
import { persist, PersistStorage, StorageValue } from 'zustand/middleware';

import DownloadModel from '../models/DownloadModel';

type State = {
	downloads: Map<string, DownloadModel>,
}

type Actions = {
	set: (v: Partial<State>) => void,
	getNewDownloadCount: () => number,
	add: (v: DownloadModel) => void,
	reset: () => void
}

export type DownloadStore = State & Actions

export function deserializer(str: string): {state: State} {
	const data: any = JSON.parse(str).state;

	const deserialized = new Map<string, DownloadModel>();

	for (const entry of Object.entries(data.downloads)) {
		// SMH...
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore This is mostly to coerce the type and please the editor
		const [ key, value ]: [string, DownloadModel] = entry;
		const model = new DownloadModel(
			value.itemId,
			value.serverId,
			value.serverUrl,
			value.apiKey,
			value.title,
			value.filename,
			value.downloadUrl
		);
		// Ignore isDownloading
		model.isComplete = value.isComplete;
		model.isNew = value.isNew;

		deserialized.set(key, model);
	}

	return {
		state: {
			downloads: deserialized
		}
	};
}

// This is needed to properly serialize/deserialize Map<String, DownloadModel>
const storage: PersistStorage<State> = {
	getItem: async (name: string): Promise<StorageValue<State>> => {
		const data = await AsyncStorage.getItem(name);
		return deserializer(data);
	},
	setItem: function(name: string, value: StorageValue<State>): void {
		const serialized = JSON.stringify({
			downloads: Array.from(value.state.downloads.entries())
		});
		AsyncStorage.setItem(name, serialized);
	},
	removeItem: function(name: string): void {
		AsyncStorage.removeItem(name);
	}
};

const initialState: State = {
	downloads: new Map<string, DownloadModel>()
};

const persistKeys = Object.keys(initialState);

export const useDownloadStore = create<State & Actions>()(
	persist(
		(_set, _get) => ({
			...initialState,
			set: (state) => { _set({ ...state }); },
			getNewDownloadCount: () => Array
				.from(_get().downloads.values())
				.filter(d => d.isNew)
				.length,
			add: (download) => {
				const downloads = _get().downloads;
				if (!downloads.has(download.key)) {
					_set({ downloads: new Map([ ...downloads, [ download.key, download ]]) });
				}
			},
			reset: () => _set({ downloads: new Map() })
		}), {
			name: 'DownloadStore',
			storage: storage,
			partialize: (state) => Object.fromEntries(
				Object.entries(state).filter(([ key ]) => persistKeys.includes(key))
			)
		}
	)
);
