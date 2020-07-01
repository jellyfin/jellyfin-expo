/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, observable } from 'mobx';
import { format } from 'mobx-sync';
import { task } from 'mobx-task';

import ServerModel from '../models/ServerModel';

export default class ServerStore {
  @format(data => data.map(value => new ServerModel(value.id, value.url, value.info)))
  @observable
  servers = []

  @action
  addServer(server) {
    this.servers.push(new ServerModel(this.servers.length, server.url));
  }

  @action
  removeServer(index) {
    this.servers.splice(index, 1);
  }

  @action
  reset() {
    this.servers = [];
  }

  @task
  async fetchInfo() {
    await Promise.all(
      this.servers.map(server => server.fetchInfo())
    );
  }
}
