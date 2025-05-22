/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, type PersistStorage, type StorageValue } from 'zustand/middleware';

import DownloadModel from '../models/DownloadModel';

import { logger } from './middleware/logger';

type State = {
	downloads: Map<string, DownloadModel>,
}

type Actions = {
	set: (value: Partial<State>) => void,
	getNewDownloadCount: () => number,
	add: (download: DownloadModel) => void,
	delete: (download: DownloadModel) => boolean,
	update: (download: DownloadModel) => void,
	reset: () => void
}

export type DownloadStore = State & Actions

const STORE_NAME = 'DownloadStore';

export const deserialize = (valueString: string | null): StorageValue<State> => {
	if (!valueString) return null;

	const value = JSON.parse(valueString);
	const downloads = new Map<string, DownloadModel>();

	if (Array.isArray(value.state.downloads)) {
		value.state.downloads.forEach(([ key, obj ]: [ string, DownloadModel ]) => {
			const model = new DownloadModel(
				obj.itemId,
				obj.serverId,
				obj.serverUrl,
				obj.apiKey,
				obj.title,
				obj.filename,
				obj.downloadUrl
			);
			model.isComplete = obj.isComplete;
			model.isNew = obj.isNew;

			downloads.set(key, model);
		});
	}

	return {
		...value,
		state: {
			...value.state,
			downloads
		}
	};
};

// This is needed to properly serialize/deserialize Map<String, DownloadModel>
const storage: PersistStorage<State> = {
	getItem: async (name: string): Promise<StorageValue<State>> => {
		const data = await AsyncStorage.getItem(name);
		return deserialize(data);
	},
	setItem: function(name: string, value: StorageValue<State>): void {
		const str = JSON.stringify({
			...value,
			state: {
				...value.state,
				downloads: Array.from(value.state.downloads.entries())
			}
		});
		AsyncStorage.setItem(name, str);
	},
	removeItem: (name: string) => AsyncStorage.removeItem(name)
};

const initialState: State = {
	downloads: new Map()
};

const persistKeys = Object.keys(initialState);

export const useDownloadStore = create<State & Actions>()(
	logger(
		persist(
			(_set, _get) => ({
				...initialState,
				set: (state) => _set({ ...state }),
				getNewDownloadCount: () => Array
					.from(_get().downloads.values())
					.filter(d => d.isNew)
					.length,
				add: (download) => {
					const downloads = _get().downloads;
					if (!downloads.has(download.key)) {
						_set({ downloads: new Map(downloads).set(download.key, download) });
					}
				},
				delete: (download) => {
					const downloads = new Map(_get().downloads);
					const isDeleted = downloads.delete(download.key);

					// If the item was deleted, push the state change
					if (isDeleted) _set({ downloads });

					return isDeleted;
				},
				update: (download) => {
					const downloads = new Map(_get().downloads)
						.set(download.key, download);
					_set({ downloads });
				},
				reset: () => _set({ downloads: new Map() })
			}), {
				name: STORE_NAME,
				storage,
				partialize: (state) => Object.fromEntries(
					Object.entries(state).filter(([ key ]) => persistKeys.includes(key))
				)
			}
		),
		STORE_NAME
	)
);
