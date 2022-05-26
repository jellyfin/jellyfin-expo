/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, decorate, observable } from 'mobx';
import { format } from 'mobx-sync-lite';
import { task } from 'mobx-task';
import { v4 as uuidv4 } from 'uuid';

import ServerModel from '../models/ServerModel';

export const DESERIALIZER = data => data.map(server => {
	// Migrate from old url format
	// TODO: Remove migration in next minor release
	const url = server.url.href || server.url;
	return new ServerModel(server.id, new URL(url), server.info);
});

export default class ServerStore {
	servers = []

	addServer(server) {
		this.servers.push(new ServerModel(uuidv4(), server.url));
	}

	removeServer(index) {
		this.servers.splice(index, 1);
	}

	reset() {
		this.servers = [];
	}

	fetchInfo = task(async () => {
		await Promise.all(
			this.servers.map(server => server.fetchInfo())
		);
	})
}

decorate(ServerStore, {
	servers: [
		format(DESERIALIZER),
		observable
	],
	addServer: action,
	removeServer: action,
	reset: action
});
