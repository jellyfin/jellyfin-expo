/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { v4 as uuidv4 } from 'uuid';

import ServerModel from '../models/ServerModel';
import { create } from 'zustand';
import { createJSONStorage, persist, PersistStorage, StorageValue } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type State = {
	servers: ServerModel[],
}

type Actions = {
	set: (v: Partial<State>) => void,
	addServer: (v: ServerModel) => void,
	removeServer: (v: number) => void,
	reset: () => void,
	fetchInfo: () => void,
}

export type ServerStore = State & Actions

export function deserializer(str: string): Promise<StorageValue<State>> {
	const data: any = JSON.parse(str).state

	const deserialized: ServerModel[] = [];

	for (const value of data.servers) {
		// Migrate from old url format 
		// TODO: Remove migration in next minor release
		const url = value.url.href || value.url;

		deserialized.push(new ServerModel(value.id, new URL(url), value.info));
	}

	return {
		state: {
			servers: deserialized
		}
	}
}

// This is needed to properly deserialize URL objects from their strings
const storage: PersistStorage<State> = {
	getItem: async (name: string): Promise<StorageValue<State>> => {
		const data = await AsyncStorage.getItem(name)
		return deserializer(data)
	},
	setItem: (name: string, value: StorageValue<State>) => {
		const serialized = JSON.stringify({
			servers: value.state.servers
		})
		AsyncStorage.setItem(name, serialized)
	},
	removeItem: function (name: string): void {
		AsyncStorage.removeItem(name)
	}
}

const initialState: State = {
	servers: []
}

const persistKeys = Object.keys(initialState)

export const useServerStore = create<State & Actions>()(
	persist(
		(_set, _get) => ({
			...initialState,
			set: (state) => { _set({ ...state }) },
			addServer: (server) => {
				const servers = _get().servers
				servers.push(new ServerModel(uuidv4(), server.url))
				_set({ servers })
			},
			removeServer: (index) => {
				const servers = _get().servers
				servers.splice(index, 1)
				_set({ servers })
			},
			reset: () => _set({ servers: [] }),
			fetchInfo: async () => {
				await Promise.all(
					_get().servers.map(server => server.fetchInfo())
				)
			}
		}), {
			name: 'ServerStore',
			// storage: createJSONStorage(() => AsyncStorage),
			storage: storage,
			partialize: (state) => Object.fromEntries(
				Object.entries(state).filter(([key]) => persistKeys.includes(key) ) 
			)
		}
	)
)