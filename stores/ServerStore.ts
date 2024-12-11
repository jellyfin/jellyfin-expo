/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { v4 as uuidv4 } from 'uuid';

import ServerModel from '../models/ServerModel';
import { create } from 'zustand';

// TODO: `data: any[]` is probably not the best choice here.
export const DESERIALIZER = (data: any[]) => data.map(server => {
	// Migrate from old url format
	// TODO: Remove migration in next minor release
	const url = server.url.href || server.url;
	return new ServerModel(server.id, new URL(url), server.info);
});

type State = {
	servers: ServerModel[],
}

type Actions = {
	addServer: (v: ServerModel) => void,
	removeServer: (v: number) => void,
	reset: () => void,
	fetchInfo: () => void,
}

export type ServerStore = State & Actions

const initialState: State = {
	servers: []
}

export const useServerStore = create<State & Actions>()((set, get) => ({
	...initialState,
	addServer: (server) => {
		const servers = get().servers
		servers.push(new ServerModel(uuidv4(), server.url))
		set({ servers })
	},
	removeServer: (index) => {
		const servers = get().servers
		servers.splice(index, 1)
		set({ servers })
	},
	reset: () => set({servers: []}),
	fetchInfo: async () => {
		await Promise.all(
			get().servers.map(server => server.fetchInfo())
		)
	}
}))