/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import ServerModel from '../models/ServerModel';

import { logger } from './middleware/logger';

type State = {
	servers: ServerModel[],
}

type Actions = {
	set: (v: Partial<State>) => void,
	addServer: (v: ServerModel) => void,
	removeServer: (v: number) => void,
	reset: () => void,
	fetchInfo: () => Promise<void>,
}

export type ServerStore = State & Actions

export const STORE_NAME = 'ServerStore';

export const reviver = (key: string, value: unknown) => {
	// Convert the url to a URL object
	if (key === 'url') {
		return new URL(value as string);
	}

	// Array entries will be referenced by the index
	// Convert each to a ServerModel
	if (Number.isInteger(parseFloat(key))) {
		const server = value as ServerModel;
		return new ServerModel(
			server.id,
			server.url,
			server.info
		);
	}

	return value;
};

const initialState: State = {
	servers: []
};

const persistKeys = Object.keys(initialState);

export const useServerStore = create<State & Actions>()(
	logger(
		persist(
			(_set, _get) => ({
				...initialState,
				set: (state) => { _set({ ...state }); },
				addServer: (server) => {
					const servers = _get().servers;
					_set({
						servers: [
							...servers,
							new ServerModel(uuidv4(), server.url)
						]
					});
				},
				removeServer: (index) => {
					const servers = _get().servers;
					_set({
						servers: servers.filter((_, i) => i !== index)
					});
				},
				reset: () => _set({ servers: [] }),
				fetchInfo: async () => {
					await Promise.all(
						_get().servers.map(server => server.fetchInfo())
					);
				}
			}), {
				name: STORE_NAME,
				storage: createJSONStorage(() => AsyncStorage, { reviver }),
				partialize: (state) => Object.fromEntries(
					Object.entries(state).filter(([ key ]) => persistKeys.includes(key))
				)
			}
		),
		STORE_NAME
	)
);
