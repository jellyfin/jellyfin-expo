/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, decorate, observable } from 'mobx';
import { format } from 'mobx-sync';
import { task } from 'mobx-task';

import ServerModel from '../models/ServerModel';

export default class ServerStore {
	servers = []

	addServer(server) {
		this.servers.push(new ServerModel(this.servers.length, server.url));
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
		format(data => data.map(value => {
			// Migrate from old url format
			// TODO: Remove migration in next minor release
			const url = value.url.href || value.url;
			return new ServerModel(value.id, new URL(url), value.info);
		})),
		observable
	],
	addServer: action,
	removeServer: action,
	reset: action
});
